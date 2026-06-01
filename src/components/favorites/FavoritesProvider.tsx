"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface FavoriteItem {
  id: string;
  slug: string;
  title: string;
  article: string | null;
  image: string | null;
}

interface FavoritesContextValue {
  items: FavoriteItem[];
  count: number;
  has: (id: string) => boolean;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  ready: boolean;
}

const STORAGE_KEY = "sportmix:favorites";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const value = useMemo<FavoritesContextValue>(() => {
    return {
      items,
      count: items.length,
      ready,
      has: (id) => items.some((i) => i.id === id),
      toggle: (item) =>
        setItems((prev) =>
          prev.some((i) => i.id === item.id)
            ? prev.filter((i) => i.id !== item.id)
            : [...prev, item]
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
