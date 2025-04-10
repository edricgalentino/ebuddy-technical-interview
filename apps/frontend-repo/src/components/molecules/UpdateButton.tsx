import React, { useState } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateUserData } from "@/store/userSlice";
import Alert from "../atoms/Alert";

interface UpdateButtonProps {
  userId: string;
  onUpdateSuccess?: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ userId, onUpdateSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.user);

  // state for alerts
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // handle update user data
  const handleUpdateUser = async () => {
    // create sample update data
    const updateData = {
      totalAverageWeightRatings: Math.round(Math.random() * 5 * 10) / 10, // random number between 0-5 with one decimal
      numberOfRents: Math.floor(Math.random() * 100), // random number between 0-100
      recentlyActive: Math.floor(Date.now()), // current timestamp in milliseconds
    };

    try {
      const resultAction = await dispatch(updateUserData({ id: userId, data: updateData }));
      if (updateUserData.fulfilled.match(resultAction)) {
        setShowSuccess(true);
        // Call the onUpdateSuccess callback if provided
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateUser}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        fullWidth
        sx={{ mb: 2 }}
      >
        {loading ? "updating..." : "update user data"}
      </Button>

      {/* success alert */}
      <Alert open={showSuccess} onClose={() => setShowSuccess(false)} severity="success" message="user data updated successfully!" />

      {/* error alert */}
      <Alert
        open={showError}
        onClose={() => setShowError(false)}
        severity="error"
        message={error || "failed to update user data. please try again."}
      />
    </Box>
  );
};

export default UpdateButton;
