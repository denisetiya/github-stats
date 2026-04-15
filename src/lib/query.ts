import { z } from "zod";

const usernameSchema = z
  .string()
  .min(1)
  .max(39)
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d-]{0,37}[a-zA-Z\d])?$/, "Invalid GitHub username");

const booleanStringSchema = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

const hexColorSchema = z
  .string()
  .regex(/^#?[a-fA-F\d]{6}$/)
  .transform((value) => (value.startsWith("#") ? value : `#${value}`))
  .optional();

export const cardQuerySchema = z.object({
  username: usernameSchema,
  theme: z.enum(["github", "dark", "light", "tokyonight"]).optional().default("github"),
  source: z.enum(["auto", "public", "private"]).optional().default("auto"),
  v: z.string().max(64).optional(),
  refresh: z.string().max(64).optional(),
  title: z.string().min(1).max(60).optional(),
  hide_border: booleanStringSchema.default(false),
  color: hexColorSchema,
});

export type CardQuery = z.infer<typeof cardQuerySchema>;

export function parseCardQuery(searchParams: URLSearchParams): CardQuery {
  return cardQuerySchema.parse({
    username: searchParams.get("username") ?? undefined,
    theme: searchParams.get("theme") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    v: searchParams.get("v") ?? undefined,
    refresh: searchParams.get("refresh") ?? undefined,
    title: searchParams.get("title") ?? undefined,
    hide_border: searchParams.get("hide_border") ?? undefined,
    color: searchParams.get("color") ?? undefined,
  });
}
