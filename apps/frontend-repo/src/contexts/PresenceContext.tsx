"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { usePresence } from "@/hooks/usePresence";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const PresenceContext = createContext<{ isInitialized: boolean }>({
  isInitialized: false,
});

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  usePresence();

  return <PresenceContext.Provider value={{ isInitialized: !!user }}>{children}</PresenceContext.Provider>;
}

export function usePresenceContext() {
  return useContext(PresenceContext);
}
