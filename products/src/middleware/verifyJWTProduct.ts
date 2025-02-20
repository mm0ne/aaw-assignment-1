import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
import { User } from "@src/commons/types";
import axios from "axios";

const authEndpoint =
  process.env.AUTH_ENDPOINT ?? "http://localhost:10000/api/auth";

const tenantEndpoint =
  process.env.TENANT_ENDPOINT ?? "http://localhost:10001/api/tenant";

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

  if (response.status == 200) return response.data.user;
  else return undefined as unknown as User;
};

const getTenant = async (tenantId: string, token: string): Promise<any> => {
  const response = await axios.get(`${tenantEndpoint}/${tenantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status == 200) return response.data;
  else return undefined as unknown as any;
};

export const verifyJWTProduct = async (
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

    console.log("[ADMIN TOKEN VERIFICATION]", payload);
    if (!payload) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const verifiedPayload = {
      status: 200,
      data: {
        user: payload,
      },
    };
    const { tenant_id } = (await jwt.decode(token)) as JWTUser;
    const tenantPayload = await getTenant(tenant_id, token);

    const verifiedTenantPayload = {
      status: 200,
      data: {
        ...tenantPayload,
      },
    };

    // Check for tenant ownership
    if (
      verifiedPayload.data.user.id !==
      verifiedTenantPayload.data.tenants.owner_id
    ) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.body.user = verifiedPayload.data.user;
    next();
  } catch (error) {
    console.error("[ERROR]", error);
    return res
      .status(401)
      .json(new UnauthenticatedResponse("Invalid token").generate());
  }
};
