import bcrypt from "bcrypt";
import { NewUser } from "@db/schema/users";
import { insertNewUser } from "../dao/insertNewUser.dao";
import { InternalServerErrorResponse } from "@src/commons/patterns";
import argon2 from 'argon2';


export const registerService = async (
  username: string,
  email: string,
  password: string,
  full_name: string,
  address: string,
  phone_number: string
) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19 * 2 ** 10,  // 46 MB
      timeCost: 2,                // Fewer iterations (you can increase this for more security)
      parallelism: 3,             // More threads (use more for multi-core systems)
    })

    if (!process.env.TENANT_ID) {
      return new InternalServerErrorResponse(
        "Server tenant ID is missing"
      ).generate();
    }

    const userData: NewUser = {
      tenant_id: process.env.TENANT_ID,
      username,
      email,
      password: hashedPassword,
      full_name,
      address,
      phone_number,
    };
    console.log("userData===>", userData);
    const newUser = await insertNewUser(userData);

    return {
      data: newUser,
      status: 201,
    };
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate();
  }
};
