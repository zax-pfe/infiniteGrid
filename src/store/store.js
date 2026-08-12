import { create } from "zustand";

export const useStore = create((set) => ({
  activeItem: null,
  activeIndex: 0,
  setActiveItem: (item) => set({ activeItem: item, activeIndex: 0 }),
  setActiveIndex: (index) => set({ activeIndex: index }),

  screenWidth: typeof window !== "undefined" ? window.innerWidth : null,
  setScreenWidth: (width) => set({ screenWidth: width }),

  // currentPage: "home",
  // setCurrentPage: (page) => set({ currentPage: page }),

  // playerAnimation: "idle",
  // setPlayerAnimation: (animation) => set({ playerAnimation: animation }),
  // cristalPosition: null,
  // setCristalPosition: (position) => set({ cristalPosition: position }),
}));
