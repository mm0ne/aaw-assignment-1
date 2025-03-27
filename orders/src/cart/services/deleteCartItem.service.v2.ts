import {
  InternalServerErrorResponse,
  NotFoundResponse,
} from "@src/commons/patterns";
import { User } from "@src/commons/types";
import { deleteCartItemByProductId } from "../dao/deleteCartItemByProductId.dao";

export const deleteCartItemServiceV2 = async (
  user: User,
  productId: string
) => {
  try {
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return new InternalServerErrorResponse("Tenant ID not found").generate();
    }

    if (!user.id) {
      return new NotFoundResponse("User not found").generate();
    }

    const cart = await deleteCartItemByProductId(
      SERVER_TENANT_ID,
      user.id,
      productId
    );

    return {
      data: cart,
      status: 200,
    };
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate();
  }
};
