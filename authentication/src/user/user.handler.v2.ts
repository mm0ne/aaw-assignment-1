import { Request, Response } from "express";
import * as Service from "./services";

export const loginHandlerV2 = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const response = await Service.loginServiceV2(username, password);
  return res.status(response.status).json(response.data);
};

export const verifyTokenHandlerV2 = async (req: Request, res: Response) => {
  const { token } = req.body;
  const response = await Service.verifyTokenService(token);
  return res.status(response.status).json(response.data);
};

export const verifyAdminTokenHandlerV2 = async (
  req: Request,
  res: Response
) => {
  const { token } = req.body;
  const response = await Service.verifyAdminTokenService(token);
  return res.status(response.status).json(response.data);
};
