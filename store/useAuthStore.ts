import { create } from "zustand";
import { io } from "socket.io-client";
import { instance } from './../src/service/index';
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8888";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // signup: async (data) => {
  //   set({ isSigningUp: true });
  //   try {
  //     const res = await instance.post("/users/register", data);
  //     set({ authUser: res.data });
  //     toast.success("Account created successfully");
  //     get().connectSocket();
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      localStorage.setItem("authUser", JSON.stringify(data));
      set({ authUser: data });

      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));