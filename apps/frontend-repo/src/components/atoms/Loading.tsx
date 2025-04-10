import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "loading..." }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} p={3}>
      <CircularProgress color="primary" />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
