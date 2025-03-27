import {
  InternalServerErrorResponse,
  NotFoundResponse,
} from "@src/commons/patterns";
import { editCategoryById } from "../dao/editCategoryById.dao";

export const editCategoryServiceV2 = async (
  category_id: string,
  name?: string
) => {
  try {
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return new InternalServerErrorResponse(
        "Server Tenant ID not found"
      ).generate();
    }

    const category = await editCategoryById(SERVER_TENANT_ID, category_id, {
      name,
    });

    if (!category) {
      return new NotFoundResponse("Category not found").generate();
    }

    return {
      data: category,
      status: 200,
    };
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate();
  }
};
