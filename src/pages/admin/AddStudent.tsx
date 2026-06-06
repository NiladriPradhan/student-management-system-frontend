import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import { getClasses } from "../../services/classes.service";
import { createStudent } from "../../services/student.service";
import type { Class as SchoolClass } from "../../types/classes";
import type { CreateStudentPayload } from "../../types/student";

const initialFormValues: CreateStudentPayload = {
  name: "",
  email: "",
  password: "",
  phone: "",
  class_id: 0,
};

export default function AddStudent() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [formValues, setFormValues] =
    useState<CreateStudentPayload>(initialFormValues);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });

  const loadClasses = async () => {
    setLoadingClasses(true);

    try {
      const response = await getClasses();
      setClasses(response.classes);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      setSnackbar({ open: true, severity: "error", message });
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadClassesEvent = useEffectEvent(loadClasses);

  useEffect(() => {
    void loadClassesEvent();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: name === "class_id" ? Number(value) : value,
    }));
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formValues.name.trim() ||
      !formValues.email.trim() ||
      !formValues.password ||
      !formValues.phone.trim() ||
      formValues.class_id <= 0
    ) {
      return "All fields are required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      return "Enter a valid email address.";
    }

    if (formValues.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitLoading(true);
    setFormError("");

    try {
      await createStudent({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        phone: formValues.phone.trim(),
        class_id: formValues.class_id,
      });

      setSnackbar({
        open: true,
        severity: "success",
        message: "Student created successfully",
      });
      setFormValues(initialFormValues);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      setSnackbar({ open: true, severity: "error", message });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PersonAddIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>
              Create Student
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create student login access and assign the student to a class.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/students")}
        >
          Back to Students
        </Button>
      </Stack>

      <Paper sx={{ p: 3, maxWidth: 720, borderRadius: 3, boxShadow: 2 }}>
        <Stack spacing={2.5}>
          {formError ? <Alert severity="error">{formError}</Alert> : null}

          <TextField
            label="Student Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            select
            label="Class"
            name="class_id"
            value={formValues.class_id}
            onChange={handleChange}
            fullWidth
            required
            disabled={loadingClasses}
            helperText={loadingClasses ? "Loading classes..." : ""}
          >
            <MenuItem value={0}>Select class</MenuItem>
            {classes.map((classItem) => (
              <MenuItem key={classItem.id} value={classItem.id}>
                {classItem.class_name}
                {classItem.section ? ` - ${classItem.section}` : ""}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              onClick={() => void handleSubmit()}
              disabled={submitLoading}
              startIcon={<PersonAddIcon />}
            >
              {submitLoading ? "Creating..." : "Create Student"}
            </Button>
            <Button
              variant="text"
              onClick={() => setFormValues(initialFormValues)}
              disabled={submitLoading}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
