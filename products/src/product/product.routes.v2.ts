import express from "express";
import { validate, verifyJWTProduct } from "@src/middleware";
import * as Validation from "./validation";
import * as Handler from "./product.handler.v2";

const router = express.Router();

router.get(
  "/:id",
  validate(Validation.getProductByIdSchema),
  Handler.getProductByIdHandlerV2
);
router.post(
  "",
  verifyJWTProduct,
  validate(Validation.createProductSchemaV2),
  Handler.createProductHandlerV2
);
router.put(
  "",
  verifyJWTProduct,
  validate(Validation.editProductSchemaV2),
  Handler.editProductHandlerV2
);
router.put(
  "/category",
  verifyJWTProduct,
  validate(Validation.editCategorySchemaV2),
  Handler.editCategoryHandlerV2
);
router.delete(
  "/:productId",
  verifyJWTProduct,
  validate(Validation.deleteProductSchema),
  Handler.deleteProductHandlerV2
);
router.delete(
  "/category/:category_id",
  verifyJWTProduct,
  validate(Validation.deleteCategorySchema),
  Handler.deleteCategoryHandlerV2
);

export default router;
