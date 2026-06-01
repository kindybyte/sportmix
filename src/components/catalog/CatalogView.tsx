"use client";

import { useMemo, useState } from "react";
import type { Category, Product, ProductStatus } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { SearchIcon, FilterIcon, CloseIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type SortKey = "new" | "price-asc" | "price-desc" | "popular" | "in-stock";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "new", label: "Новинки" },
  { key: "popular", label: "Популярные" },
  { key: "in-stock", label: "Сначала в наличии" },
  { key: "price-asc", label: "Цена: по возрастанию" },
  { key: "price-desc", label: "Цена: по убыванию" },
];

const STATUS_OPTIONS: { key: ProductStatus; label: string }[] = [
  { key: "in_stock", label: "В наличии" },
  { key: "on_order", label: "Под заказ" },
  { key: "coming_soon", label: "Скоро" },
];

export function CatalogView({
  products,
  categories,
  initialCategory,
  initialSort,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSort?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(initialCategory ?? null);
  const [fabric, setFabric] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [status, setStatus] = useState<ProductStatus | null>(null);
  const [sort, setSort] = useState<SortKey>(
    (SORTS.find((s) => s.key === initialSort)?.key ?? "new") as SortKey
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Варианты фильтров из данных
  const fabrics = useMemo(
    () => unique(products.map((p) => p.fabric).filter(Boolean) as string[]),
    [products]
  );
  const sizes = useMemo(
    () => unique(products.flatMap((p) => p.sizes)),
    [products]
  );
  const colors = useMemo(
    () => unique(products.flatMap((p) => p.colors)),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.slice();
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.article ?? "").toLowerCase().includes(q) ||
          (p.fabric ?? "").toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((p) => p.category?.slug === category);
    if (fabric) list = list.filter((p) => p.fabric === fabric);
    if (size) list = list.filter((p) => p.sizes.includes(size));
    if (color) list = list.filter((p) => p.colors.includes(color));
    if (status) list = list.filter((p) => p.status === status);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
      case "popular":
        list.sort((a, b) => Number(b.is_popular) - Number(a.is_popular));
        break;
      case "in-stock":
        list.sort(
          (a, b) =>
            Number(b.status === "in_stock") - Number(a.status === "in_stock")
        );
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.is_new) - Number(a.is_new) ||
            +new Date(b.created_at) - +new Date(a.created_at)
        );
    }
    return list;
  }, [products, search, category, fabric, size, color, status, sort]);

  const activeCount =
    [fabric, size, color, status].filter(Boolean).length + (category ? 1 : 0);

  function reset() {
    setCategory(null);
    setFabric(null);
    setSize(null);
    setColor(null);
    setStatus(null);
    setSearch("");
  }

  const filtersPanel = (
    <div className="space-y-7">
      <FilterGroup title="Категории">
        <Pill active={!category} onClick={() => setCategory(null)}>Все</Pill>
        {categories.map((c) => (
          <Pill key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
            {c.title}
          </Pill>
        ))}
      </FilterGroup>

      {fabrics.length > 0 && (
        <FilterGroup title="Ткань">
          <Pill active={!fabric} onClick={() => setFabric(null)}>Любая</Pill>
          {fabrics.map((f) => (
            <Pill key={f} active={fabric === f} onClick={() => setFabric(f)}>{f}</Pill>
          ))}
        </FilterGroup>
      )}

      {sizes.length > 0 && (
        <FilterGroup title="Размеры">
          <Pill active={!size} onClick={() => setSize(null)}>Все</Pill>
          {sizes.map((s) => (
            <Pill key={s} active={size === s} onClick={() => setSize(s)}>{s}</Pill>
          ))}
        </FilterGroup>
      )}

      {colors.length > 0 && (
        <FilterGroup title="Цвета">
          <Pill active={!color} onClick={() => setColor(null)}>Все</Pill>
          {colors.map((c) => (
            <Pill key={c} active={color === c} onClick={() => setColor(c)}>{c}</Pill>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Наличие">
        <Pill active={!status} onClick={() => setStatus(null)}>Любое</Pill>
        {STATUS_OPTIONS.map((s) => (
          <Pill key={s.key} active={status === s.key} onClick={() => setStatus(s.key)}>
            {s.label}
          </Pill>
        ))}
      </FilterGroup>

      {activeCount > 0 && (
        <button onClick={reset} className="btn btn-ghost btn-md text-signal">
          Сбросить фильтры ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Десктоп-фильтры */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filtersPanel}</div>
      </aside>

      <div>
        {/* Панель поиска / сортировки */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, артикулу, ткани…"
              className="field pl-12"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltersOpen(true)}
              className="btn btn-outline btn-md lg:hidden"
            >
              <FilterIcon className="h-4 w-4" />
              Фильтры{activeCount ? ` · ${activeCount}` : ""}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="field max-w-[220px] cursor-pointer appearance-none pr-9"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="mb-5 text-sm text-muted">
          Найдено товаров: <span className="font-semibold text-ink">{filtered.length}</span>
        </p>

        {filtered.length === 0 ? (
          <div className="card grid place-items-center py-20 text-center">
            <p className="font-display text-lg font-semibold">Ничего не найдено</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Попробуйте изменить фильтры или сбросить их. Если нужной модели нет —
              напишите нам, изготовим под заказ.
            </p>
            <button onClick={reset} className="btn btn-outline btn-md mt-5">Сбросить фильтры</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Мобильные фильтры (drawer) */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-paper p-6 shadow-lift animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Фильтры</h3>
              <button onClick={() => setFiltersOpen(false)} className="btn btn-ghost h-9 w-9 rounded-full p-0">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            {filtersPanel}
            <button onClick={() => setFiltersOpen(false)} className="btn btn-primary btn-lg mt-8 w-full">
              Показать {filtered.length} товаров
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">{title}</h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={cn("chip", active && "chip-active")}>
      {children}
    </button>
  );
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );
}
