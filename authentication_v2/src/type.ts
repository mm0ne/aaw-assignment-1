import { t } from "elysia";

export const registerSchema = t.Object({
  username: t.String(),
  email: t.String({ format: "email" }),
  password: t.String({
    minLength: 8,
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
  }),
  full_name: t.String(),
  address: t.String(),
  phone_number: t.String(),
});

export const loginSchema = t.Object({
  username: t.String(),
  password: t.String(),
});
