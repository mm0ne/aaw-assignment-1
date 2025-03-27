import express from "express";
import { validate } from "@src/middleware/validate";
import * as Validation from "./validation";
import * as Handler from "./user.handler.v2";

const router = express.Router();

router.post("/login", validate(Validation.loginSchema), Handler.loginHandlerV2);

export default router;
