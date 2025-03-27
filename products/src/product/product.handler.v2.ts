import { Request, Response } from "express";
import * as Service from "./services";

export const getProductByIdHandlerV2 = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await Service.getProductByIdServiceV2(id);
  return res.status(response.status).send(response.data);
};

export const editProductHandlerV2 = async (req: Request, res: Response) => {
  const { name, description, price, quantity_available, category_id, id } =
    req.body;
  const response = await Service.editProductServiceV2(
    id,
    name,
    description,
    price,
    quantity_available,
    category_id
  );
  return res.status(response.status).send(response.data);
};

export const editCategoryHandlerV2 = async (req: Request, res: Response) => {
  const { name, category_id } = req.body;
  const response = await Service.editCategoryServiceV2(category_id, name);
  return res.status(response.status).send(response.data);
};

export const deleteProductHandlerV2 = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await Service.deleteProductServiceV2(id);
  return res.status(response.status).send(response.data);
};

export const deleteCategoryHandlerV2 = async (req: Request, res: Response) => {
  const { category_id } = req.params;
  const response = await Service.deleteCategoryServiceV2(category_id);
  return res.status(response.status).send(response.data);
};
