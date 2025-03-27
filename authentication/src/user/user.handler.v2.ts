import { Request, Response } from "express";
import * as Service from "./services";

export const loginHandlerV2 = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const response = await Service.loginServiceV2(username, password);
  return res.status(response.status).json(response.data);
};
