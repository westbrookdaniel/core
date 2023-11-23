import { z } from "zod";

type Validated<I> = {
  parsed: z.SafeParseReturnType<I, I>;
  raw: Record<string, any>;
};

export async function validate<I>(
  itter: Iterable<[string, unknown]>,
  zodSchema: z.ZodType<I>,
): Promise<Validated<I>> {
  const raw = Object.fromEntries(itter);
  const parsed = zodSchema.safeParse(raw);
  return { parsed, raw };
}
