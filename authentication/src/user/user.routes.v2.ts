import express from "express";
import { validate } from "@src/middleware/validate";
import * as Validation from "./validation";
import * as Handler from "./user.handler.v2";

const router = express.Router();

router.post("/login", validate(Validation.loginSchema), Handler.loginHandlerV2);

router.post(
  "/verify-token",
  validate(Validation.verifyTokenSchema),
  Handler.verifyTokenHandlerV2
);

export default router;
