import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import type { Teacher, TeacherFormValues } from "../../types/teacher";

interface TeacherFormProps {
  open: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSubmit: (values: TeacherFormValues) => Promise<void>;
  loading?: boolean;
  errorMessage?: string;
}

const initialFormValues: TeacherFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  subject: "",
  employment_type: "full_time",
  gender: "",
  date_of_birth: "",
  address: "",
  profile_image: "",
};

export default function TeacherForm({
  open,
  teacher,
  onClose,
  onSubmit,
  loading = false,
  errorMessage = "",
}: TeacherFormProps) {
  const [formValues, setFormValues] =
    useState<TeacherFormValues>(initialFormValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setFormValues(initialFormValues);
      setError("");
      return;
    }

    if (teacher) {
      setFormValues({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        subject: teacher.subject,
        employment_type: teacher.employment_type,
        gender: teacher.gender,
        date_of_birth: teacher.date_of_birth,
        address: teacher.address,
        profile_image: teacher.profile_image,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [open, teacher]);

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!formValues.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formValues.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!teacher && !formValues.password?.trim()) {
      setError("Password is required for new teachers.");
      return;
    }

    if (!formValues.phone.trim()) {
      setError("Phone is required.");
      return;
    }

    if (!formValues.subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (!formValues.gender.trim()) {
      setError("Gender is required.");
      return;
    }

    if (!formValues.date_of_birth.trim()) {
      setError("Date of birth is required.");
      return;
    }

    try {
      setError("");
      await onSubmit(formValues);
      setFormValues(initialFormValues);
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {teacher ? "Update Teacher" : "Create New Teacher"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Full Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., Prof. Robert Smith"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., robert@school.com"
          />

          {!teacher && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formValues.password || ""}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Set initial password for login"
              helperText="Teacher must use this to login"
            />
          )}

          <TextField
            label="Phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., +1234567890"
          />

          <TextField
            label="Subject"
            name="subject"
            value={formValues.subject}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., Physics"
          />

          <TextField
            label="Employment Type"
            name="employment_type"
            value={formValues.employment_type}
            onChange={handleChange}
            select
            fullWidth
            required
          >
            <MenuItem value="full_time">Full-time</MenuItem>
            <MenuItem value="part_time">Part-time</MenuItem>
          </TextField>

          <TextField
            label="Gender"
            name="gender"
            value={formValues.gender}
            onChange={handleChange}
            select
            fullWidth
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formValues.date_of_birth}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="e.g., 123 Main Street, City, Country"
          />

          <TextField
            label="Profile Image URL"
            name="profile_image"
            value={formValues.profile_image}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., https://example.com/image.jpg"
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
          {loading ? "Saving..." : teacher ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
