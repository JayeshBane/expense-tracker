import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as api from "../services/api";

const TOKEN_KEY = "token";

export const useAuthStore = create(
  devtools(
    (set, get) => ({
      token: localStorage.getItem(TOKEN_KEY),
      user: null,
      // Authenticated optimistically if a token is present; loadUser() confirms
      // it against the server on startup.
      isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { token, user } = await api.login(email, password);
          localStorage.setItem(TOKEN_KEY, token);
          set({ token, user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.error ?? "Login failed",
            isLoading: false,
          });
          return false;
        }
      },

      // Validate an existing token on app start and hydrate the user.
      loadUser: async () => {
        if (!get().token) return;

        try {
          const { user } = await api.getMe();
          set({ user, isAuthenticated: true });
        } catch (err) {
          // 401 is handled by the axios interceptor (which fires auth:logout).
          get().logout();
        }
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ token: null, user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    { name: "AuthStore" },
  ),
);

// The axios response interceptor dispatches this when a request is rejected with
// a 401, so an expired token anywhere in the app drops us back to the login view.
window.addEventListener("auth:logout", () => {
  useAuthStore.getState().logout();
});
