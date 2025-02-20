import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
import axios from "axios";
import { User } from "@src/commons/types";
interface JWTUser extends JwtPayload {
  id: string;
  tenant_id: string;
}
const authEndpoint =
  process.env.AUTH_ENDPOINT ?? "http://localhost:10000/api/auth";

const verifyToken = async (token: string): Promise<User> => {
  const body = {
    token: token,
  };
  const response = await axios.post(`${authEndpoint}/verify-token`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) return response.data;
  else return undefined as unknown as User;
};

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res
        .status(401)
        .json(new UnauthenticatedResponse("No token provided").generate());
    }
    const authResponse = await verifyToken(token);
    if (!authResponse) {
      return res
        .status(401)
        .json(new UnauthenticatedResponse("Invalid token").generate());
    }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTUser;

    // const SERVER_TENANT_ID = process.env.TENANT_ID;
    // if (SERVER_TENANT_ID && decoded.tenant_id !== SERVER_TENANT_ID) {
    //   return res
    //     .status(401)
    //     .json(new UnauthenticatedResponse("Invalid tenant").generate());
    // }

    req.body.user = authResponse;

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new UnauthenticatedResponse("Invalid token").generate());
  }
};
