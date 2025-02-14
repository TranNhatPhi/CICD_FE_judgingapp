import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username should have at least 2 letters" }),
  password: z.string().trim().min(1, { message: "Required!" }),
});

export const LoginFormErrors = zodResolver(LoginSchema);
