import { Request, Response } from "express";
import * as Service from "./services";

export const getOrderDetailHandlerV2 = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { orderId } = req.params;
  const response = await Service.getOrderDetailServiceV2(user, orderId);
  return res.status(response.status).send(response.data);
};

export const placeOrderHandlerV2 = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { shipping_provider } = req.body;
  const response = await Service.placeOrderServiceV2(user, shipping_provider);
  return res.status(response.status).send(response.data);
};

export const payOrderHandlerV2 = async (req: Request, res: Response) => {
  const { payment_method, payment_reference, amount, orderId } = req.body;
  const response = await Service.payOrderService(
    orderId,
    payment_method,
    payment_reference,
    amount
  );
  return res.status(response.status).send(response.data);
};

export const cancelOrderHandlerV2 = async (req: Request, res: Response) => {
  const { user, orderId } = req.body;
  const response = await Service.cancelOrderService(user, orderId);
  return res.status(response.status).send(response.data);
};
