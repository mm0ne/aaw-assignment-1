import {
  BadRequestResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
} from "@src/commons/patterns";
import { NewPayment } from "@db/schema/payment";
import { payOrder } from "../dao/payOrder.dao";
import { getOrderById } from "../dao/getOrderById.dao";
import { User } from "@src/commons/types";

export const payOrderServiceV2 = async (
  user_id: string | undefined,
  order_id: string,
  payment_method: string,
  payment_reference: string,
  amount: number
) => {
  try {
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return new InternalServerErrorResponse(
        "Server tenant id not found"
      ).generate();
    }

    if (!user_id) {
      return new NotFoundResponse("User not found").generate();
    }

    const order = await getOrderById(SERVER_TENANT_ID, user_id, order_id);

    if (!order) {
      return new NotFoundResponse("Order Not Found").generate();
    }

    const paymentData: NewPayment = {
      tenant_id: SERVER_TENANT_ID,
      order_id: order_id,
      payment_method,
      payment_reference,
      amount,
    };

    const payment = await payOrder(paymentData);

    return {
      data: payment,
      status: 200,
    };
  } catch (err: any) {
    if (err.message === "Rollback") {
      return new BadRequestResponse(
        "Payment amount does not match order total amount"
      ).generate();
    }

    return new InternalServerErrorResponse(err).generate();
  }
};
