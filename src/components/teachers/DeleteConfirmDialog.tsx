import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import type { Teacher } from "../../types/teacher";

interface DeleteConfirmDialogProps {
  open: boolean;
  teacher: Teacher | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  teacher,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
        <WarningIcon sx={{ color: "error.main" }} />
        Delete Teacher
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete{" "}
            <strong>{teacher?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The teacher record will be permanently
            deleted from the system.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
