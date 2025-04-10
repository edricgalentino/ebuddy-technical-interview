"use client";

import React, { useState } from "react";
import { Container, Box, Typography, Paper, Button } from "@mui/material";
import LoginForm from "@/components/molecules/LoginForm";
import RegistrationForm from "@/components/molecules/RegistrationForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container component="div" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ebuddy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            technical interview frontend
          </Typography>
        </Box>

        {isLogin ? <LoginForm /> : <RegistrationForm />}

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="text" color="primary" onClick={toggleAuthMode}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
