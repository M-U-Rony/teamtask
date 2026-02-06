import { z } from "zod";
export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),

  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});


export const loginSchema = z.object({

    email: z.email(),
    password:z.string()

})

export const projectSchema = z.object({
  name: z.string().min(2).trim(),
  description: z.string().trim().optional(),
  members: z.array(objectIdSchema).optional().default([]),
})

export const addOrremoveSchema = z.object({
  operation: z.enum(["add","remove"]),
  users: z.array(objectIdSchema),
})