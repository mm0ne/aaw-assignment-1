import express from "express";
import { validate, verifyJWT } from "@src/middleware";
import * as Validation from "./validation";
import * as Handler from "./cart.handler.v2";

const router = express.Router();

router.put(
  "",
  verifyJWT,
  validate(Validation.editCartItemSchema),
  Handler.editCartItemHandlerV2
);
router.delete(
  "/:productId",
  verifyJWT,
  validate(Validation.deleteCartItemSchemaV2),
  Handler.deleteCartItemHandlerV2
);

export default router;
