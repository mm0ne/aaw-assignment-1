import Elysia from "elysia";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../type";
import bcrypt from "bcrypt";
import { insertNewUser } from "@src/dao/insertNewUser.dao";
import { getUserByUsername } from "@src/dao/getUserByUsername.dao";
import { User } from "@db/schema/users";
import { performance } from "perf_hooks";
import argon2 from "argon2";

const authRouter = new Elysia({
  prefix: "/api/v1/auth",
})
  .post(
    "/register",
    async ({ body }) => {
      const { username, password, email, full_name, phone_number, address } =
        body;
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(password, salt);
      const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19 * 2 ** 10,  // 46 MB
        timeCost: 2,                // Fewer iterations (you can increase this for more security)
        parallelism: 3,             // More threads (use more for multi-core systems)
      }
    )

      const userData = {
        tenant_id: process.env.TENANT_ID,
        username,
        email,
        password: hashedPassword,
        full_name,
        address,
        phone_number,
      };
      const insertResult = await insertNewUser(userData);
      return {
        data: insertResult,
        status: 201,
      };
    },
    { body: registerSchema }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      const SERVER_TENANT_ID = process.env.TENANT_ID!;
      const { username, password } = body;
      const user: User = await getUserByUsername(username, SERVER_TENANT_ID);
      const startTime = performance.now()
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      const isPasswordValid = await argon2.verify(user.password, password)
      const endTime = performance.now()


      console.log(`[INFO] Time taken for bcrypt hash compare ${(endTime - startTime).toFixed(2)}`)
      if (!user || !isPasswordValid) {
        set.status == 400;
        return {
          message: "Invalid username or password!",
        };
      }

      const payload = {
        id: user.id,
        tenant_id: user.tenant_id,
      };
      const secret: string = process.env.JWT_SECRET as string;
      const token = jwt.sign(payload, secret, {
        expiresIn: "1d",
      });

      return {
        data: {
          token,
        },
        status: 200,
      };
    },
    { body: loginSchema }
  );

export default authRouter;
