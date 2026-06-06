import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import TeacherTable from "../../components/teachers/TeacherTable";
import TeacherForm from "../../components/teachers/TeacherForm";
import DeleteConfirmDialog from "../../components/teachers/DeleteConfirmDialog";
import { getApiErrorMessage } from "../../services/api";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  searchTeachers,
  updateTeacher,
} from "../../services/teacher.service";
import type { Teacher, TeacherFormValues } from "../../types/teacher";

/**
 * Check if teacher matches search keyword
 */
// const matchesSearch = (teacher: Teacher, keyword: string) => {
//   const normalizedKeyword = keyword.trim().toLowerCase();

//   if (!normalizedKeyword) {
//     return true;
//   }

//   return [teacher.name, teacher.email, teacher.subject].some((value) =>
//     (value ?? "").toLowerCase().includes(normalizedKeyword),
//   );
// };

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });

  /**
   * Display snackbar notification
   */
  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Load teachers from API
   */
  const loadTeachers = async (keyword = "") => {
    setLoading(true);

    try {
      const response = keyword.trim()
        ? await searchTeachers(keyword.trim())
        : await getTeachers();

      setTeachers(response.teachers);
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and search debounce
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTeachers(search);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  /**
   * Open create teacher form
   */
  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setFormError("");
    setFormOpen(true);
  };

  /**
   * Open edit teacher form
   */
  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormError("");
    setFormOpen(true);
  };

  /**
   * Close form dialog
   */
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTeacher(null);
    setFormError("");
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSubmit = async (values: TeacherFormValues) => {
    setSubmitLoading(true);
    setFormError("");

    try {
      const normalizedPayload = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
      };

      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, normalizedPayload);
        await loadTeachers(search);
        showSnackbar("Teacher updated successfully.");
      } else {
        await createTeacher(normalizedPayload);
        await loadTeachers(search);
        showSnackbar("Teacher created successfully.");
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

  /**
   * Open delete confirmation dialog
   */
  const handleOpenDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDeleteOpen(true);
  };

  /**
   * Close delete confirmation dialog
   */
  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setTeacherToDelete(null);
  };

  /**
   * Handle teacher deletion
   */
  const handleDelete = async () => {
    if (!teacherToDelete) {
      return;
    }

    setSubmitLoading(true);

    try {
      await deleteTeacher(teacherToDelete.id);
      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== teacherToDelete.id),
      );
      showSnackbar("Teacher deleted successfully.");
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
          Teachers Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add New Teacher
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search teachers..."
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
            onClick={() => void loadTeachers(search)}
          >
            Refresh
          </Button>
        </Box>

        <TeacherTable
          teachers={teachers}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </Paper>

      {/* Teacher Form Dialog */}
      <TeacherForm
        open={formOpen}
        teacher={editingTeacher}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        loading={submitLoading}
        errorMessage={formError}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        teacher={teacherToDelete}
        onConfirm={handleDelete}
        onCancel={handleCloseDelete}
        loading={submitLoading}
      />

      {/* Success/Error Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
