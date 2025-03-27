import {
  InternalServerErrorResponse,
  NotFoundResponse,
} from "@src/commons/patterns";
import { deleteProductById } from "../dao/deleteProductById.dao";

export const deleteProductServiceV2 = async (id: string) => {
  try {
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return new InternalServerErrorResponse(
        "Server Tenant ID not found"
      ).generate();
    }

    const product = await deleteProductById(SERVER_TENANT_ID, id);

    if (!product) {
      return new NotFoundResponse("Product not found").generate();
    }

    return {
      data: {
        ...product,
      },
      status: 200,
    };
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate();
  }
};
