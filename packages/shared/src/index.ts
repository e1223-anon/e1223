import { z } from "zod";

export const helloWorldSchema = z.object({
  msg: z.string(),
});

export type HelloWorld = z.infer<typeof helloWorldSchema>;
