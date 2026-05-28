import { object, string, InferType } from "yup";

export const emailSchema = object({
  name: string()
    .required("This field is required")
    .min(3, "Name must be at least 3 characters long"),
  email: string().email("Invalid email").required("This field is required"),
  message: string().required("This field is required"),
});

export type EmailFormSchema = InferType<typeof emailSchema>;
