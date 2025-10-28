import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Item {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  price_idr: number;
  category: string;
}

interface InventoryStore {
  items: Item[];
  addItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updatedData: Partial<Item>) => void;
  setItems: (items: Item[]) => void;
  clearItems: () => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set({ items: [...get().items, item] }),

      deleteItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),

      updateItem: (id, updatedData) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item
          ),
        }),

      setItems: (items) => set({ items }),

      clearItems: () => set({ items: [] }),
    }),
    {
      name: "inventory-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
export default {};
