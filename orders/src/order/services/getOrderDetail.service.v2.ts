import {
  BadRequestResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
} from "@src/commons/patterns";
import { getOrderById } from "../dao/getOrderById.dao";
import { getOrderDetail } from "../dao/getOrderDetail.dao";
import { User } from "@src/commons/types";

export const getOrderDetailServiceV2 = async (user: User, order_id: string) => {
  try {
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      throw new Error("SERVER_TENANT_ID is not defined");
    }

    if (!user.id) {
      return new NotFoundResponse("User not found").generate();
    }

    if (!order_id) {
      return new BadRequestResponse("Missing orderId parameter").generate();
    }

    const orderDetail = await getOrderDetail(SERVER_TENANT_ID, order_id);

    const order = await getOrderById(
      SERVER_TENANT_ID,
      user.id,
      orderDetail?.order_id
    );
    if (!order || !orderDetail) {
      return new NotFoundResponse("Order not found").generate();
    }
    if (order.user_id !== user.id) {
      return new UnauthorizedResponse("User is not authorized").generate();
    }

    return {
      data: {
        ...orderDetail,
      },
      status: 200,
    };
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate();
  }
};
