import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum")
      .max(20, "Password is too long - should be 20 chars maximum")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Password much match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum")
      .max(20, "Password is too long - should be 20 chars maximum")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});
