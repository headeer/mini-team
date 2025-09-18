import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";

export interface CartItem {
  product: Product;
  quantity: number;
  configuration?: {
    mount?: { title?: string; price?: number };
    drill?: { title?: string; price?: number };
    dimensions?: { A?: number; B?: number; C?: number; D?: number };
    photoAssetId?: string;
    teeth?: { enabled: boolean; price?: number };
  };
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  addConfiguredItem: (
    product: Product,
    configuration?: {
      mount?: { title?: string; price?: number };
      drill?: { title?: string; price?: number };
      dimensions?: { A?: number; B?: number; C?: number; D?: number };
      photoAssetId?: string;
      teeth?: { enabled: boolean; price?: number };
    }
  ) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  //   // favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      addItem: (product) =>
        set((state) => {
          const anyP = product as any;
          const candidate = anyP?.pricing?.priceNet ?? anyP?.priceNet ?? anyP?.basePrice ?? anyP?.price ?? 0;
          const numeric = typeof candidate === 'string' ? parseFloat(candidate) : Number(candidate) || 0;
          const p = {
            ...anyP,
            pricing: { ...(anyP?.pricing || {}), priceNet: numeric },
          } as any;
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product: p, quantity: 1 }] };
          }
        }),
      addConfiguredItem: (product, configuration) =>
        set((state) => {
          const anyP = product as any;
          const candidate = anyP?.pricing?.priceNet ?? anyP?.priceNet ?? anyP?.basePrice ?? anyP?.price ?? 0;
          const numeric = typeof candidate === 'string' ? parseFloat(candidate) : Number(candidate) || 0;
          const p = {
            ...anyP,
            pricing: { ...(anyP?.pricing || {}), priceNet: numeric },
          } as any;
          const normalize = (cfg?: {
            mount?: { title?: string; price?: number };
            drill?: { title?: string; price?: number };
            dimensions?: { A?: number; B?: number; C?: number; D?: number };
            photoAssetId?: string;
            teeth?: { enabled: boolean; price?: number };
            machine?: { brandModel?: string; weight?: number | string };
            hasQuickCoupler?: boolean;
          }) => ({
            mount: cfg?.mount ? { title: cfg.mount.title, price: cfg.mount.price } : undefined,
            drill: cfg?.drill ? { title: cfg.drill.title, price: cfg.drill.price } : undefined,
            dimensions: cfg?.dimensions ? { ...cfg.dimensions } : undefined,
            photoAssetId: cfg?.photoAssetId,
            teeth: cfg?.teeth ? { enabled: !!cfg.teeth.enabled, price: cfg.teeth.price } : undefined,
            machine: cfg?.machine ? { brandModel: cfg.machine.brandModel, weight: cfg.machine.weight } : undefined,
            hasQuickCoupler: typeof cfg?.hasQuickCoupler === 'boolean' ? cfg?.hasQuickCoupler : undefined,
          });
          const normalized = normalize(configuration);
          const existingItem = state.items.find(
            (item) =>
              item.product._id === p._id &&
              JSON.stringify(normalize(item.configuration)) === JSON.stringify(normalized)
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === p._id &&
                JSON.stringify(normalize(item.configuration)) === JSON.stringify(normalized)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                { product: p, quantity: 1, configuration: normalized },
              ],
            };
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(
            ({ product }) => product?._id !== productId
          ),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const priceNetCandidate = (item.product as any)?.pricing?.priceNet ?? (item.product as any)?.priceNet ?? (item.product as any)?.basePrice ?? item.product.price ?? 0;
          const priceNet = typeof priceNetCandidate === 'string' ? parseFloat(priceNetCandidate) : Number(priceNetCandidate) || 0;
          const extras = (item.configuration?.mount?.price ?? 0) + (item.configuration?.drill?.price ?? 0) + (item.configuration?.teeth?.enabled ? (item.configuration?.teeth?.price ?? 0) : 0);
          return total + (Number(priceNet) + extras) * item.quantity;
        }, 0);
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const baseCandidate = (item.product as any)?.pricing?.priceNet ?? (item.product as any)?.priceNet ?? (item.product as any)?.basePrice ?? item.product.price ?? 0;
          const baseNet = typeof baseCandidate === 'string' ? parseFloat(baseCandidate) : Number(baseCandidate) || 0;
          const discountPct = (item.product.discount ?? 0);
          const discountedPrice = Number(baseNet) + (discountPct * Number(baseNet)) / 100;
          const extras = (item.configuration?.mount?.price ?? 0) + (item.configuration?.drill?.price ?? 0) + (item.configuration?.teeth?.enabled ? (item.configuration?.teeth?.price ?? 0) : 0);
          return total + (discountedPrice + extras) * item.quantity;
        }, 0);
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?._id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;
