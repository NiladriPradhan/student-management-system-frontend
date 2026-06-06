import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import type {
  Attendance,
  AttendanceFormValues,
} from "../../types/attendance";

interface AttendanceFormProps {
  open: boolean;
  attendance: Attendance | null;
  onClose: () => void;
  onSubmit: (values: AttendanceFormValues) => Promise<void>;
  loading?: boolean;
  errorMessage?: string;
}

const initialFormValues: AttendanceFormValues = {
  student_id: 0,
  attendance_date: "",
  status: "present",
  remarks: "",
};

export default function AttendanceForm({
  open,
  attendance,
  onClose,
  onSubmit,
  loading = false,
  errorMessage = "",
}: AttendanceFormProps) {
  const [formValues, setFormValues] =
    useState<AttendanceFormValues>(initialFormValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setFormValues(initialFormValues);
      setError("");
      return;
    }

    if (attendance) {
      setFormValues({
        student_id: attendance.student_id,
        attendance_date: attendance.attendance_date,
        status: attendance.status,
        remarks: attendance.remarks,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [open, attendance]);

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: name === "student_id" ? Number(value) : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!formValues.student_id) {
      setError("Student ID is required.");
      return;
    }

    if (!formValues.attendance_date) {
      setError("Attendance date is required.");
      return;
    }

    if (!formValues.status) {
      setError("Attendance status is required.");
      return;
    }

    try {
      setError("");
      await onSubmit(formValues);
    } catch {
      // Parent handles errors.
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {attendance ? "Update Attendance" : "Mark Attendance"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Student ID"
            name="student_id"
            type="number"
            value={formValues.student_id || ""}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Enter student ID"
          />

          <TextField
            label="Attendance Date"
            name="attendance_date"
            type="date"
            value={formValues.attendance_date}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            select
            fullWidth
            required
          >
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
            <MenuItem value="late">Late</MenuItem>
          </TextField>

          <TextField
            label="Remarks"
            name="remarks"
            value={formValues.remarks}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Optional notes"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? "Saving..." : attendance ? "Update" : "Mark"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
