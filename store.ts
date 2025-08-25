import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";

export interface CartItem {
  product: Product;
  quantity: number;
  configuration?: {
    mount?: { title?: string; price?: number };
    drill?: { title?: string; price?: number };
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
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      addConfiguredItem: (product, configuration) =>
        set((state) => {
          const normalize = (cfg?: {
            mount?: { title?: string; price?: number };
            drill?: { title?: string; price?: number };
          }) => ({
            mount: cfg?.mount ? { title: cfg.mount.title, price: cfg.mount.price } : undefined,
            drill: cfg?.drill ? { title: cfg.drill.title, price: cfg.drill.price } : undefined,
          });
          const normalized = normalize(configuration);
          const existingItem = state.items.find(
            (item) =>
              item.product._id === product._id &&
              JSON.stringify(normalize(item.configuration)) === JSON.stringify(normalized)
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id &&
                JSON.stringify(normalize(item.configuration)) === JSON.stringify(normalized)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                { product, quantity: 1, configuration: normalized },
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
          const base = item.product.price ?? 0;
          const extras = (item.configuration?.mount?.price ?? 0) + (item.configuration?.drill?.price ?? 0);
          return total + (base + extras) * item.quantity;
        }, 0);
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discountedPrice = price + discount;
          const extras = (item.configuration?.mount?.price ?? 0) + (item.configuration?.drill?.price ?? 0);
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
