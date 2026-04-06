import { create } from "zustand";

export const useStore = create((set) => ({
  activeItem: null,
  setActiveItem: (item) => set({ activeItem: item }),

  screenWidth: typeof window !== "undefined" ? window.innerWidth : null,
  setScreenWidth: (width) => set({ screenWidth: width }),

  // playerAnimation: "idle",
  // setPlayerAnimation: (animation) => set({ playerAnimation: animation }),
  // cristalPosition: null,
  // setCristalPosition: (position) => set({ cristalPosition: position }),
}));
