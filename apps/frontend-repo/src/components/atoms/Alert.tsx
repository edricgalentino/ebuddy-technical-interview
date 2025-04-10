import React from "react";
import { Alert as MuiAlert, AlertProps as MuiAlertProps, Snackbar } from "@mui/material";

interface AlertProps extends Omit<MuiAlertProps, "onClose"> {
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ open, onClose, autoHideDuration = 6000, severity = "info", message, ...rest }) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <MuiAlert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }} {...rest}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
