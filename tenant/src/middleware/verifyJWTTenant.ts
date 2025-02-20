import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
import { User } from "@src/commons/types";
import axios from "axios";

const authEndpoint =
  process.env.AUTH_ENDPOINT ?? "http://localhost:10000/api/auth";

interface JWTUser extends JwtPayload {
  id: string;
  tenant_id: string;
}

const verifyAdminToken = async (token: string): Promise<User> => {
  const body = {
    token: token,
  };
  const response = await axios.post(
    `${authEndpoint}/verify-admin-token`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status == 200) return response.data;
  else return undefined as unknown as User;
};

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const verifiedPayload = {
      status: 200,
      data: {
        user: payload,
      },
    };

    req.body.user = verifiedPayload.data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new UnauthenticatedResponse("Invalid token").generate());
  }
};
