"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "@/firebase/firebase"; // Import for side effects only
import { PresenceProvider } from "@/contexts/PresenceContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PresenceProvider>{children}</PresenceProvider>
      </ThemeProvider>
    </Provider>
  );
}
