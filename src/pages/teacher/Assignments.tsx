import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Groups as GroupsIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentFileUrl,
  getAssignmentSubmissions,
  getTeacherAssignments,
  updateAssignment,
} from "../../services/assignment.service";
import { getClasses } from "../../services/classes.service";
import type {
  Assignment,
  AssignmentFormValues,
  AssignmentSubmission,
} from "../../types/assignment";
import type { Class as SchoolClass } from "../../types/classes";

const initialFormValues: AssignmentFormValues = {
  class_id: 0,
  title: "",
  description: "",
  due_date: "",
};

const formatDate = (value: string) => {
  if (!value) {
    return "N/A";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (assignment: Assignment) => {
  if (!assignment.due_date) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${assignment.due_date}T00:00:00`) < today;
};

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<Assignment | null>(null);
  const [formValues, setFormValues] =
    useState<AssignmentFormValues>(initialFormValues);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState("");
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
    setSnackbar({ open: true, severity, message });
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [assignmentList, classList] = await Promise.all([
        getTeacherAssignments(),
        getClasses(),
      ]);

      setAssignments(assignmentList);
      setClasses(classList.classes);
    } catch (loadError) {
      const message = getApiErrorMessage(loadError);
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreateDialog = () => {
    setSelectedAssignment(null);
    setFormValues(initialFormValues);
    setFormError("");
    setFormOpen(true);
  };

  const openEditDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormValues({
      id: assignment.id,
      class_id: assignment.class_id,
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
    });
    setFormError("");
    setFormOpen(true);
  };

  const closeFormDialog = () => {
    if (submitLoading) {
      return;
    }

    setFormOpen(false);
    setFormError("");
  };

  const handleSave = async () => {
    const normalizedValues = {
      ...formValues,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
    };

    if (
      !normalizedValues.class_id ||
      !normalizedValues.title ||
      !normalizedValues.due_date
    ) {
      setFormError("Class, title, and due date are required.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");

    try {
      if (selectedAssignment) {
        await updateAssignment({
          ...normalizedValues,
          id: selectedAssignment.id,
        });
        showSnackbar("Assignment updated successfully.");
      } else {
        await createAssignment(normalizedValues);
        showSnackbar("Assignment created successfully.");
      }

      setFormOpen(false);
      await loadData();
    } catch (saveError) {
      const message = getApiErrorMessage(saveError);
      setFormError(message);
      showSnackbar(message, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const openDeleteDialog = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (submitLoading) {
      return;
    }

    setAssignmentToDelete(null);
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (!assignmentToDelete) {
      return;
    }

    setSubmitLoading(true);

    try {
      await deleteAssignment(assignmentToDelete.id);
      showSnackbar("Assignment deleted successfully.");
      setDeleteOpen(false);
      setAssignmentToDelete(null);
      await loadData();
    } catch (deleteError) {
      showSnackbar(getApiErrorMessage(deleteError), "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const openSubmissionsDialog = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissions([]);
    setSubmissionsOpen(true);
    setSubmissionsLoading(true);

    try {
      const payload = await getAssignmentSubmissions(assignment.id);
      setSelectedAssignment(payload.assignment);
      setSubmissions(payload.submissions);
    } catch (submissionError) {
      showSnackbar(getApiErrorMessage(submissionError), "error");
    } finally {
      setSubmissionsLoading(false);
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
            <AssignmentIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>
              Assignments
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create and manage assignments for your assigned classes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Create Assignment
        </Button>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Assignment List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assignments.length} assignment
              {assignments.length === 1 ? "" : "s"}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => void loadData()}>
            Refresh
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton height={30} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 7, textAlign: "center" }}>
                      <AssignmentIcon
                        color="disabled"
                        sx={{ fontSize: 48, mb: 1 }}
                      />
                      <Typography variant="h6" fontWeight={600}>
                        No assignments yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>
                        Create your first assignment for an assigned class.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openCreateDialog}
                      >
                        Create Assignment
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => {
                  const submissionsCount = assignment.submissions_count ?? 0;
                  const totalStudents = assignment.total_students ?? 0;
                  const overdue = isOverdue(assignment);

                  return (
                    <TableRow key={assignment.id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {assignment.title}
                        </Typography>
                        {assignment.description ? (
                          <Typography variant="caption" color="text.secondary">
                            {assignment.description}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {assignment.class_name}
                        {assignment.section ? ` - ${assignment.section}` : ""}
                      </TableCell>
                      <TableCell>{formatDate(assignment.due_date)}</TableCell>
                      <TableCell>
                        {submissionsCount}/{totalStudents}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={overdue ? "Overdue" : "Active"}
                          color={overdue ? "warning" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => void openSubmissionsDialog(assignment)}
                            aria-label="View submissions"
                          >
                            <GroupsIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(assignment)}
                            aria-label="Edit assignment"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(assignment)}
                            aria-label="Delete assignment"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={formOpen} onClose={closeFormDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAssignment ? "Edit Assignment" : "Create Assignment"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Class"
              value={formValues.class_id}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  class_id: Number(event.target.value),
                }))
              }
              fullWidth
              required
            >
              <MenuItem value={0}>Select class</MenuItem>
              {classes.map((classItem) => (
                <MenuItem key={classItem.id} value={classItem.id}>
                  {classItem.class_name}
                  {classItem.section ? ` - ${classItem.section}` : ""}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Title"
              value={formValues.title}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              fullWidth
              required
            />
            <TextField
              label="Due Date"
              type="date"
              value={formValues.due_date}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  due_date: event.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              multiline
              rows={4}
              fullWidth
            />
            {formError ? <Alert severity="error">{formError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFormDialog} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={submitLoading}
          >
            {selectedAssignment ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={submissionsOpen}
        onClose={() => setSubmissionsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Student Submissions</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedAssignment?.title || "Assignment"}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell align="right">File</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissionsLoading ? (
                  Array.from({ length: 4 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array.from({ length: 5 }).map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton height={30} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography
                        color="text.secondary"
                        sx={{ py: 4, textAlign: "center" }}
                      >
                        No students found for this assignment.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.student_id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {submission.student_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {submission.student_email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status}
                          color={
                            submission.status === "submitted"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {submission.submitted_at
                          ? new Date(
                              submission.submitted_at.replace(" ", "T"),
                            ).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>{submission.remarks || "-"}</TableCell>
                      <TableCell align="right">
                        {submission.file_path ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              component="a"
                              href={getAssignmentFileUrl(submission.file_path)}
                              target="_blank"
                              rel="noreferrer"
                              size="small"
                              color="primary"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              component="a"
                              href={getAssignmentFileUrl(submission.file_path)}
                              download
                              size="small"
                              color="primary"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Assignment</DialogTitle>
        <DialogContent>
          <Typography>
            Delete "{assignmentToDelete?.title || "this assignment"}"? Existing
            student submissions for it will also be removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={submitLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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
