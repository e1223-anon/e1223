import { z } from "zod";

export const generatorStateDaoSchema = z.object({
  grid: z.string().length(100).regex(/[a-z]/),
  code: z.string().length(2),
  configAllowedInMs: z.number().int(),
  expiresInMs: z.number().int(),
});

export type GeneratorStateDao = z.infer<typeof generatorStateDaoSchema>;

export const generatorPutSchema = z.object({
  bias: z.string().length(1).regex(/[a-z]/).optional(),
});

export type GeneratorPut = z.infer<typeof generatorPutSchema>;
export type GeneratorPutReturn = GeneratorStateDao;
