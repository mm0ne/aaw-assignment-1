import express from "express";
import { validate, verifyJWT } from "@src/middleware";
import * as Validation from "./validation";
import * as Handler from "./order.handler.v2";

const router = express.Router();

router.get(
  "/:orderId",
  verifyJWT,
  validate(Validation.getOrderDetailSchema),
  Handler.getOrderDetailHandlerV2
);
router.post(
  "",
  verifyJWT,
  validate(Validation.placeOrderSchema),
  Handler.placeOrderHandlerV2
);
router.post(
  "/pay",
  validate(Validation.payOrderSchemaV2),
  Handler.payOrderHandlerV2
);
router.post(
  "/cancel",
  verifyJWT,
  validate(Validation.cancelOrderSchemaV2),
  Handler.cancelOrderHandlerV2
);

export default router;
