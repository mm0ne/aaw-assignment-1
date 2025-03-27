import { Request, Response } from "express";
import * as Service from "./services";
export const editCartItemHandlerV2 = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { cart_id, quantity } = req.body;
  const response = await Service.editCartItemServiceV2(user, cart_id, quantity);
  return res.status(response.status).send(response.data);
};

export const deleteCartItemHandlerV2 = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { productId } = req.params;
  const response = await Service.deleteCartItemServiceV2(user, productId);
  return res.status(response.status).send(response.data);
};
