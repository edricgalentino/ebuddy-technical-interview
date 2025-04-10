import React, { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { signOut } from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    try {
      await dispatch(signOut());
      router.push("/");
    } catch (error) {
      console.error("logout error:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ebuddy dashboard
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          ) : (
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          mt: "auto",
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            ebuddy technical interview - {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
