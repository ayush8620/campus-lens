import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { MAX_COMPARE_COLLEGES } from "@/lib/constants";

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
}

interface CompareState {
  colleges: CompareItem[];
  isOpen: boolean;
}

interface CompareActions {
  addCollege: (college: CompareItem) => void;
  removeCollege: (id: string) => void;
  clearAll: () => void;
  toggleBar: () => void;
}

type CompareStore = CompareState & CompareActions;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      colleges: [],
      isOpen: false,

      addCollege: (college) => {
        const { colleges } = get();

        if (colleges.some((c) => c.id === college.id)) {
          toast.info(`${college.name} is already in the comparison list.`);
          return;
        }

        if (colleges.length >= MAX_COMPARE_COLLEGES) {
          toast.error(
            `You can compare up to ${MAX_COMPARE_COLLEGES} colleges at a time. Remove one to add another.`
          );
          return;
        }

        set({ colleges: [...colleges, college], isOpen: true });
        toast.success(`${college.name} added to comparison.`);
      },

      removeCollege: (id) => {
        const { colleges } = get();
        const updated = colleges.filter((c) => c.id !== id);
        set({
          colleges: updated,
          isOpen: updated.length > 0,
        });
      },

      clearAll: () => {
        set({ colleges: [], isOpen: false });
        toast.info("Comparison list cleared.");
      },

      toggleBar: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: "campus-lens-compare",
    }
  )
);
