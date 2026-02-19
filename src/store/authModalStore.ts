import { create } from "zustand";

interface AuthModalState {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const useAuthModalStore = create<AuthModalState>((set) => ({
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));

export default useAuthModalStore;
