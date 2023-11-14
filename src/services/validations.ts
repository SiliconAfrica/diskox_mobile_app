import { z } from "zod";

const loginSchema = z.object({
  email: z.string().nonempty("Email cannot be empty").email("Invalid email"),
  password: z.string().nonempty("Password is required"),
});

const registerSchema = z.object({
  username: z.string().nonempty("Username cannot be empty"),
  email: z.string().nonempty("Email cannot be empty").email("Invalid email"),
  password: z
    .string()
    .nonempty("Password cannot be empty")
    .min(8, "Password must be at least 8 characters long"),
  password_confirmation: z
    .string()
    .nonempty("Password cannot be empty")
    .min(8, "Password must be at least 8 characters long"),
});

const usernameSelectSchema = z.object({
  username: z.string().nonempty("Username cannot be empty"),
  email: z.string().nonempty("Email cannot be empty").email("Invalid email"),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password cannot be empty")
      .min(8, "Password must be at least 8 characters long"),
    password_confirmation: z
      .string()
      .nonempty("Password cannot be empty")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const resetpasswordSchema = z
  .object({
    otp: z
      .string()
      .nonempty("OTP cannot be empty")
      .max(4, "OTP must be at least 4 characters long")
      .min(4, "OTP must be at least 4 characters long"),
    password: z
      .string()
      .nonempty("Password cannot be empty")
      .min(8, "Password must be at least 8 characters long"),
    password_confirmation: z
      .string()
      .nonempty("Password cannot be empty")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const emailResetSchema = z.object({
  email: z.string().nonempty("Email cannot be empty").email("Invalid email"),
});

const changePasswordSchema = z
  .object({
    current_password: z.string().nonempty("Password cannot be empty"),
    password: z
      .string()
      .nonempty("Password cannot be empty")
      .min(8, "Password must be at least 8 characters long"),
    password_confirmation: z
      .string()
      .nonempty("Password cannot be empty")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const editCommunity = z.object({
  name: z.string().nonempty(),
  username: z.string().nonempty(),
  description: z.string().nonempty(),
});

const createCommunityValidation = z.object({
  name: z.string().nonempty(),
  username: z.string().nonempty(),
  description: z.string().nonempty(),
});

export {
  loginSchema,
  registerSchema,
  usernameSelectSchema,
  passwordSchema,
  emailResetSchema,
  resetpasswordSchema,
  changePasswordSchema,
  editCommunity,
  createCommunityValidation,
};
