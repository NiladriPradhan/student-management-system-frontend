import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
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
  Assignment as AssignmentIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import {
  getAssignmentFileUrl,
  getClassAssignments,
  getMySubmissions,
  submitAssignment,
} from "../../services/assignment.service";
import type {
  Assignment,
  AssignmentSubmission,
} from "../../types/assignment";

const maxSubmissionSize = 10 * 1024 * 1024;

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

const statusColor = (status: string) => {
  if (status === "submitted") {
    return "success";
  }

  if (status === "late") {
    return "error";
  }

  return "warning";
};

export default function StudentAssignments() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      const [assignmentList, submissionList] = await Promise.all([
        getClassAssignments(),
        getMySubmissions(),
      ]);

      setAssignments(assignmentList);
      setSubmissions(submissionList);
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

  const openUploadDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFile(null);
    setRemarks("");
    setUploadProgress(0);
    setFormError("");
    setUploadOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeUploadDialog = () => {
    if (submitLoading) {
      return;
    }

    setUploadOpen(false);
    setSelectedAssignment(null);
    setSelectedFile(null);
    setRemarks("");
    setFormError("");
    setUploadProgress(0);
  };

  const handleFileChange = (file: File | null) => {
    setFormError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
      setSelectedFile(null);
      setFormError("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    if (file.size > maxSubmissionSize) {
      setSelectedFile(null);
      setFormError("Submission file must be 10MB or smaller.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !selectedFile) {
      setFormError("Please choose a file to upload.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");
    setUploadProgress(0);

    try {
      await submitAssignment(
        {
          assignment_id: selectedAssignment.id,
          remarks: remarks.trim(),
          file: selectedFile,
        },
        setUploadProgress,
      );

      showSnackbar("Assignment submitted successfully.");
      setUploadOpen(false);
      await loadData();
    } catch (submitError) {
      const message = getApiErrorMessage(submitError);
      setFormError(message);
      showSnackbar(message, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const submittedCount = assignments.filter(
    (assignment) => assignment.submission_status === "submitted",
  ).length;
  const pendingCount = assignments.filter(
    (assignment) => assignment.submission_status !== "submitted",
  ).length;

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
            View and submit assignments from your enrolled classes.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadData()}>
          Refresh
        </Button>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Class Assignments
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
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
                        <Typography variant="body2" color="text.secondary">
                          New assignments from your classes will appear here.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => {
                    const submitted =
                      assignment.submission_status === "submitted";

                    return (
                      <TableRow key={assignment.id} hover>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {assignment.title}
                          </Typography>
                          {assignment.description ? (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {assignment.description}
                            </Typography>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {assignment.class_name}
                          {assignment.section ? ` - ${assignment.section}` : ""}
                        </TableCell>
                        <TableCell>{assignment.teacher_name || "-"}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <ScheduleIcon sx={{ fontSize: 16 }} />
                            <span>{formatDate(assignment.due_date)}</span>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={assignment.submission_status || "pending"}
                            color={statusColor(
                              assignment.submission_status || "pending",
                            )}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {submitted && assignment.file_path ? (
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                            >
                              <IconButton
                                component="a"
                                href={getAssignmentFileUrl(assignment.file_path)}
                                target="_blank"
                                rel="noreferrer"
                                size="small"
                                color="primary"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                component="a"
                                href={getAssignmentFileUrl(assignment.file_path)}
                                download
                                size="small"
                                color="primary"
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<UploadIcon />}
                              onClick={() => openUploadDialog(assignment)}
                            >
                              Submit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Stack spacing={3} sx={{ width: { xs: "100%", md: 320 } }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Submission Stats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {loading ? <Skeleton width={48} /> : pendingCount}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Submitted
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {loading ? <Skeleton width={48} /> : submittedCount}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Submissions
              </Typography>
              {loading ? (
                <Stack spacing={1}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} height={34} />
                  ))}
                </Stack>
              ) : submissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No submissions yet.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {submissions.slice(0, 5).map((submission) => (
                    <Box key={submission.id ?? submission.assignment_id}>
                      <Typography variant="body2" fontWeight={600}>
                        {submission.assignment_title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {submission.submitted_at
                          ? new Date(
                              submission.submitted_at.replace(" ", "T"),
                            ).toLocaleString()
                          : "Submitted"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Stack>

      <Dialog open={uploadOpen} onClose={closeUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Assignment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography fontWeight={600}>
                {selectedAssignment?.title || "Assignment"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due {formatDate(selectedAssignment?.due_date || "")}
              </Typography>
            </Box>
            <TextField
              label="Remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
              Choose File
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(event) =>
                  handleFileChange(event.target.files?.[0] ?? null)
                }
              />
            </Button>
            {selectedFile ? (
              <Typography variant="body2" color="text.secondary">
                Selected: {selectedFile.name}
              </Typography>
            ) : null}
            {submitLoading ? (
              <Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary">
                  Uploading {uploadProgress}%
                </Typography>
              </Box>
            ) : null}
            {formError ? <Alert severity="error">{formError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUploadDialog} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitAssignment}
            disabled={submitLoading || !selectedFile}
          >
            Submit
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
