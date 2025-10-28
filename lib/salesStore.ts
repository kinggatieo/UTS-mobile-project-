import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Sale = {
  id: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  date: string;
};

type SalesStore = {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  resetDailySales: () => void;
};

export const useSalesStore = create<SalesStore>()(
  persist(
    (set, get) => ({
      sales: [],

      addSale: (sale) =>
        set({
          sales: [...get().sales, sale],
        }),

      resetDailySales: () => set({ sales: [] }),
    }),
    {
      name: "sales-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default {};
