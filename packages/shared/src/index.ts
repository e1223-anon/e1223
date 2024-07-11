import { z } from "zod";

export const generatorGetSchema = z.object({
  grid: z.object({
    rows: z.number(),
    cols: z.number(),
    data: z.string().length(100).regex(/[a-z]/),
  }),
  code: z.string().length(2),
});

export type Grid = z.infer<typeof generatorGetSchema>["grid"];

export type GeneratorGet = z.infer<typeof generatorGetSchema>;

export const generatorPutSchema = z.object({
  bias: z.string().length(1).regex(/[a-z]/).optional(),
});

export type GeneratorPut = z.infer<typeof generatorPutSchema>;
export type GeneratorPutReturn = GeneratorGet;
