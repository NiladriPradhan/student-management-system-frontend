import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import StudentTable from "../../components/students/StudentTable";
import { getApiErrorMessage } from "../../services/api";
import {
  createStudent,
  deleteStudent,
  getStudents,
  searchStudents,
  updateStudent,
} from "../../services/student.service";
import type { Student, StudentFormValues } from "../../types/student";

const initialFormValues: StudentFormValues = {
  name: "",
  email: "",
  phone: "",
  course: "",
  gender: "",
  date_of_birth: "",
  address: "",
  profile_image: "",
};

const matchesSearch = (student: Student, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [student.name, student.email, student.course].some((value) =>
    (value ?? "").toLowerCase().includes(normalizedKeyword),
  );
};

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [formValues, setFormValues] =
    useState<StudentFormValues>(initialFormValues);
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const loadStudents = async (keyword = "") => {
    setLoading(true);

    try {
      const response = keyword.trim()
        ? await searchStudents(keyword.trim())
        : await getStudents();

      setStudents(response.students);
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStudents(search);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormError("");
    setFormValues({
      name: student.name ?? "",
      email: student.email ?? "",
      phone: student.phone ?? "",
      course: student.course ?? "",
      gender: student.gender ?? "",
      date_of_birth: student.date_of_birth ?? "",
      address: student.address ?? "",
      profile_image: student.profile_image ?? "",
    });
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingStudent(null);
    setFormError("");
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formValues.name.trim() || !formValues.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");

    try {
      const normalizedPayload = {
        ...formValues,
        name: formValues.name.trim(),
        email: formValues.email.trim(),
      };

      if (editingStudent) {
        const updatedStudent = await updateStudent(
          editingStudent.id,
          normalizedPayload,
        );

        setStudents((prev) => {
          const next = prev
            .map((student) =>
              student.id === updatedStudent.id ? updatedStudent : student,
            )
            .filter((student) => matchesSearch(student, search));

          return next;
        });

        showSnackbar("Student updated successfully.");
      } else {
        const createdStudent = await createStudent(normalizedPayload);

        setStudents((prev) =>
          matchesSearch(createdStudent, search)
            ? [createdStudent, ...prev]
            : prev,
        );

        showSnackbar("Student created successfully.");
      }

      handleCloseForm();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      showSnackbar(message, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDelete = (student: Student) => {
    setStudentToDelete(student);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setStudentToDelete(null);
  };

  const handleDelete = async () => {
    if (!studentToDelete) {
      return;
    }

    setSubmitLoading(true);

    try {
      await deleteStudent(studentToDelete.id);
      setStudents((prev) =>
        prev.filter((student) => student.id !== studentToDelete.id),
      );
      showSnackbar("Student deleted successfully.");
      handleCloseDelete();
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Students Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/students/create")}
        >
          Add New Student
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 260 }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void loadStudents(search)}
          >
            Refresh
          </Button>
        </Box>

        <StudentTable
          students={students}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </Paper>

      <Dialog open={formOpen} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingStudent ? "Update Student" : "Create Student"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Full Name"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={formValues.phone}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Course"
              name="course"
              value={formValues.course}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formValues.gender}
              onChange={handleFormChange}
              fullWidth
            >
              <MenuItem value="">Select gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formValues.date_of_birth}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Address"
              name="address"
              value={formValues.address}
              onChange={handleFormChange}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Profile Image URL"
              name="profile_image"
              value={formValues.profile_image}
              onChange={handleFormChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseForm} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleSubmit()}
            disabled={submitLoading}
          >
            {submitLoading
              ? "Saving..."
              : editingStudent
                ? "Update Student"
                : "Create Student"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>{studentToDelete?.name ?? "this student"}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDelete} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDelete()}
            disabled={submitLoading}
          >
            {submitLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
