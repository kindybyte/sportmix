export type ProductStatus = "in_stock" | "on_order" | "coming_soon";
export type LeadStatus = "new" | "in_progress" | "done" | "canceled";

export interface Category {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  article: string | null;
  category_id: string | null;
  fabric: string | null;
  sizes: string[];
  colors: string[];
  price: number | null;
  min_order_quantity: number | null;
  description: string | null;
  status: ProductStatus;
  is_new: boolean;
  is_popular: boolean;
  is_visible: boolean;
  season: string | null;
  gender: string | null;
  origin: string | null;
  created_at: string;
  updated_at: string;
  // joins
  category?: Category | null;
  images?: ProductImage[];
}

export interface Lead {
  id: string;
  product_id: string | null;
  product_title: string | null;
  product_article: string | null;
  client_name: string;
  city: string | null;
  contact: string;
  color: string | null;
  size: string | null;
  quantity: string | null;
  comment: string | null;
  type: string;
  status: LeadStatus;
  created_at: string;
}

export interface Settings {
  id: number;
  company_name: string;
  telegram_username: string | null;
  whatsapp_number: string | null;
  city: string | null;
  delivery_text: string | null;
  about_text: string | null;
  logo_url: string | null;
  experience_text: string | null;
}

export type ProductionSection = "step" | "gallery";

export interface ProductionPhoto {
  id: string;
  section: ProductionSection;
  title: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  city: string | null;
  text: string;
  rating: number;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  in_stock: "В наличии",
  on_order: "Под заказ",
  coming_soon: "Скоро",
};

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  canceled: "Отменена",
};
