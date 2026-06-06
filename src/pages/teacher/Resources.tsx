import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
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
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  OpenInNew as ViewIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import { getClasses } from "../../services/classes.service";
import {
  deleteResource,
  getResourceFileUrl,
  getTeacherResources,
  uploadResource,
} from "../../services/resource.service";
import type { Class as SchoolClass } from "../../types/classes";
import type { Resource } from "../../types/resource";

const maxPdfSize = 10 * 1024 * 1024;

const initialFormValues = {
  title: "",
  description: "",
  class_id: 0,
};

const formatDate = (value: string) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TeacherResources() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      const [resourceList, classList] = await Promise.all([
        getTeacherResources(),
        getClasses(),
      ]);

      setResources(resourceList);
      setClasses(classList.classes);
    } catch (loadError) {
      const message = getApiErrorMessage(loadError);
      setError(message);
      setResources([]);
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadDataEvent = useEffectEvent(loadData);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDataEvent();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const resourceCountLabel = useMemo(
    () => `${resources.length} PDF${resources.length === 1 ? "" : "s"}`,
    [resources.length],
  );

  const handleOpenUpload = () => {
    setFormValues(initialFormValues);
    setSelectedFile(null);
    setUploadProgress(0);
    setFormError("");
    setFormOpen(true);
  };

  const handleCloseUpload = () => {
    if (submitLoading) {
      return;
    }

    setFormOpen(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setFormError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setFormError("Only PDF files are allowed.");
      return;
    }

    if (file.size > maxPdfSize) {
      setSelectedFile(null);
      setFormError("PDF file must be 10MB or smaller.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    const normalizedTitle = formValues.title.trim();
    const normalizedDescription = formValues.description.trim();

    if (!normalizedTitle || !formValues.class_id || !selectedFile) {
      setFormError("Title, class, and PDF file are required.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");
    setUploadProgress(0);

    try {
      await uploadResource(
        {
          title: normalizedTitle,
          description: normalizedDescription,
          class_id: formValues.class_id,
          file: selectedFile,
        },
        setUploadProgress,
      );

      showSnackbar("Resource uploaded successfully.");
      setFormOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
      setFormError("");
      await loadData();
    } catch (uploadError) {
      const message = getApiErrorMessage(uploadError);
      setFormError(message);
      showSnackbar(message, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDelete = (resource: Resource) => {
    setResourceToDelete(resource);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    if (submitLoading) {
      return;
    }

    setResourceToDelete(null);
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) {
      return;
    }

    setSubmitLoading(true);

    try {
      await deleteResource(resourceToDelete.id);
      showSnackbar("Resource deleted successfully.");
      setResourceToDelete(null);
      setDeleteOpen(false);
      await loadData();
    } catch (deleteError) {
      showSnackbar(getApiErrorMessage(deleteError), "error");
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
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PdfIcon color="error" />
            <Typography variant="h4" fontWeight={700}>
              Teaching Resources
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload PDF study materials for the classes assigned to you.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleOpenUpload}
        >
          Upload Resource
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Uploaded Materials
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {resourceCountLabel}
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton height={30} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 7, textAlign: "center" }}>
                      <PdfIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        No resources uploaded yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>
                        Upload your first PDF study material for students.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={handleOpenUpload}
                      >
                        Upload Resource
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => {
                  const fileUrl = getResourceFileUrl(resource.file_path);
                  const classLabel = `${resource.class_name || "Class"}${
                    resource.section ? ` - ${resource.section}` : ""
                  }`;

                  return (
                    <TableRow key={resource.id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{resource.title}</Typography>
                        {resource.description ? (
                          <Typography variant="caption" color="text.secondary">
                            {resource.description}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>{classLabel}</TableCell>
                      <TableCell>{resource.file_name}</TableCell>
                      <TableCell>{formatDate(resource.created_at)}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            component="a"
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            color="primary"
                            size="small"
                            aria-label="View resource"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            component="a"
                            href={fileUrl}
                            download={resource.file_name}
                            color="primary"
                            size="small"
                            aria-label="Download resource"
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDelete(resource)}
                            aria-label="Delete resource"
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

      <Dialog open={formOpen} onClose={handleCloseUpload} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Study Material</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
              label="Description"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              multiline
              rows={3}
              fullWidth
            />
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
            <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
              Choose PDF
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
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
          <Button onClick={handleCloseUpload} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={submitLoading || !selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleCloseDelete} fullWidth maxWidth="xs">
        <DialogTitle>Delete Resource</DialogTitle>
        <DialogContent>
          <Typography>
            Delete "{resourceToDelete?.title || "this resource"}"? Students will
            no longer be able to access this PDF.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={submitLoading}>
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
