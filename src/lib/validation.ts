import { z } from "zod";

/** Заявка по конкретному товару или из корзины избранного. */
export const leadSchema = z.object({
  client_name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(80, "Слишком длинное имя"),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  contact: z
    .string()
    .trim()
    .min(3, "Укажите Telegram или WhatsApp")
    .max(120, "Слишком длинный контакт"),
  color: z.string().trim().max(120).optional().or(z.literal("")),
  size: z.string().trim().max(120).optional().or(z.literal("")),
  quantity: z.string().trim().max(60).optional().or(z.literal("")),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
  product_id: z.string().uuid().optional().or(z.literal("")),
  product_title: z.string().trim().max(200).optional().or(z.literal("")),
  product_article: z.string().trim().max(120).optional().or(z.literal("")),
  type: z.enum(["product", "price", "cart"]).default("product"),
  // honeypot — должно быть пустым (защита от ботов)
  website: z.string().max(0, "spam").optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Заявка «Получить прайс» — минимум полей. */
export const priceRequestSchema = z.object({
  client_name: z.string().trim().min(2, "Укажите имя").max(80),
  contact: z.string().trim().min(3, "Укажите контакт").max(120),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type PriceRequestInput = z.infer<typeof priceRequestSchema>;
