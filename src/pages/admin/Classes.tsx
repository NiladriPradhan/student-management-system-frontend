import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ManageAccounts as ManageAccountsIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import {
  assignStudentToClass,
  assignTeacherToClass,
  createClass,
  deleteClass,
  getClassStudents,
  getClasses,
  getTeacherAssignments,
  removeStudentFromClass,
  removeTeacherAssignment,
  updateClass,
} from "../../services/classes.service";
import { getStudents } from "../../services/student.service";
import { getTeachers } from "../../services/teacher.service";
import type { Class, ClassFormValues, TeacherAssignment } from "../../types/classes";
import type { Student } from "../../types/student";
import type { Teacher } from "../../types/teacher";

const initialFormValues: ClassFormValues = {
  class_name: "",
  section: "",
};

type AssignmentTab = "teachers" | "students";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState(0);
  const [assignmentSubject, setAssignmentSubject] = useState("");
  const [tab, setTab] = useState<AssignmentTab>("teachers");
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [formValues, setFormValues] = useState<ClassFormValues>(initialFormValues);
  const [formError, setFormError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
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

  const filteredClasses = useMemo(() => {
    if (!search.trim()) {
      return classes;
    }

    const keyword = search.trim().toLowerCase();
    return classes.filter((item) =>
      [item.class_name, item.section]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [classes, search]);

  const loadData = async () => {
    setLoading(true);

    try {
      const [classResult, teacherList, studentList, teacherAssignmentList] =
        await Promise.all([
          getClasses(),
          getTeachers(),
          getStudents(),
          getTeacherAssignments(),
        ]);

      setClasses(classResult.classes);
      setTeachers(teacherList.teachers);
      setStudents(studentList.students);
      setTeacherAssignments(teacherAssignmentList);
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
      setClasses([]);
      setTeachers([]);
      setStudents([]);
      setTeacherAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const loadClassStudents = async (classId: number) => {
    setActionLoading(true);

    try {
      const studentsInClass = await getClassStudents(classId);
      setClassStudents(studentsInClass);
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
      setClassStudents([]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormError("");
    setFormValues(initialFormValues);
    setFormOpen(true);
  };

  const handleOpenEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormError("");
    setFormValues({
      class_name: classItem.class_name,
      section: classItem.section,
    });
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingClass(null);
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!formValues.class_name.trim()) {
      setFormError("Class name is required.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");

    try {
      if (editingClass) {
        const updatedClass = await updateClass(editingClass.id, {
          class_name: formValues.class_name.trim(),
          section: formValues.section.trim(),
        });

        setClasses((prev) =>
          prev.map((item) =>
            item.id === editingClass.id ? { ...item, ...updatedClass } : item,
          ),
        );

        showSnackbar("Class updated successfully.");
      } else {
        const createdClass = await createClass({
          class_name: formValues.class_name.trim(),
          section: formValues.section.trim(),
        });

        setClasses((prev) => [createdClass, ...prev]);
        showSnackbar("Class created successfully.");
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

  const handleOpenDelete = (classItem: Class) => {
    setClassToDelete(classItem);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setClassToDelete(null);
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (!classToDelete) {
      return;
    }

    setSubmitLoading(true);

    try {
      await deleteClass(classToDelete.id);
      setClasses((prev) => prev.filter((item) => item.id !== classToDelete.id));
      showSnackbar("Class deleted successfully.");
      handleCloseDelete();
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenManage = async (classItem: Class) => {
    setSelectedClass(classItem);
    setAssignmentError("");
    setSelectedTeacherId(0);
    setSelectedStudentId(0);
    setAssignmentSubject("");
    setTab("teachers");
    setManageOpen(true);
    await loadClassStudents(classItem.id);
  };

  const handleCloseManage = () => {
    setSelectedClass(null);
    setClassStudents([]);
    setManageOpen(false);
    setAssignmentError("");
  };

  const selectedClassTeacherAssignments = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    return teacherAssignments.filter(
      (assignment) => assignment.class_id === selectedClass.id,
    );
  }, [selectedClass, teacherAssignments]);

  const classTeacherIds = useMemo(
    () => selectedClassTeacherAssignments.map((assignment) => assignment.teacher_id),
    [selectedClassTeacherAssignments],
  );

  const availableTeachers = useMemo(
    () => teachers.filter((teacher) => !classTeacherIds.includes(teacher.id)),
    [teachers, classTeacherIds],
  );

  const availableStudents = useMemo(
    () =>
      students.filter(
        (student) => !classStudents.some((existing) => existing.id === student.id),
      ),
    [students, classStudents],
  );

  const handleTeacherSelection = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    const teacher = teachers.find((item) => item.id === teacherId);
    setAssignmentSubject(teacher?.subject ?? "");
  };

  const handleAssignTeacher = async () => {
    if (!selectedClass) {
      return;
    }

    if (selectedTeacherId <= 0) {
      setAssignmentError("Please select a teacher.");
      return;
    }

    if (!assignmentSubject.trim()) {
      setAssignmentError("Subject is required for the assignment.");
      return;
    }

    setActionLoading(true);
    setAssignmentError("");

    try {
      await assignTeacherToClass(
        selectedTeacherId,
        selectedClass.id,
        assignmentSubject.trim(),
      );
      const updatedAssignments = await getTeacherAssignments();
      setTeacherAssignments(updatedAssignments);
      showSnackbar("Teacher assigned to class.");
      setSelectedTeacherId(0);
      setAssignmentSubject("");
    } catch (error) {
      const message = getApiErrorMessage(error);
      setAssignmentError(message);
      showSnackbar(message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveTeacher = async (assignmentId: number) => {
    if (!selectedClass) {
      return;
    }

    setActionLoading(true);

    try {
      await removeTeacherAssignment(assignmentId);
      const updatedAssignments = await getTeacherAssignments();
      setTeacherAssignments(updatedAssignments);
      showSnackbar("Teacher removed from class.");
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedClass) {
      return;
    }

    if (selectedStudentId <= 0) {
      setAssignmentError("Please select a student.");
      return;
    }

    setActionLoading(true);
    setAssignmentError("");

    try {
      await assignStudentToClass(selectedStudentId, selectedClass.id);
      await loadClassStudents(selectedClass.id);
      showSnackbar("Student assigned to class.");
      setSelectedStudentId(0);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setAssignmentError(message);
      showSnackbar(message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedClass) {
      return;
    }

    setActionLoading(true);

    try {
      await removeStudentFromClass(studentId, selectedClass.id);
      await loadClassStudents(selectedClass.id);
      showSnackbar("Student removed from class.");
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
    } finally {
      setActionLoading(false);
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
          Classes Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add New Class
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void loadData()}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search classes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#9e9e9e" }} />, 
            }}
            sx={{ flex: 1, minWidth: 260 }}
          />
          <Button
            variant="contained"
            onClick={() => void loadData()}
            startIcon={<RefreshIcon />}
          >
            Reload
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Assigned Teachers</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={24} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No classes found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((classItem) => {
                  const assignedTeacherCount = teacherAssignments.filter(
                    (assignment) => assignment.class_id === classItem.id,
                  ).length;

                  return (
                    <TableRow key={classItem.id}>
                      <TableCell>{classItem.class_name}</TableCell>
                      <TableCell>{classItem.section || "—"}</TableCell>
                      <TableCell>{assignedTeacherCount}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ManageAccountsIcon />}
                            onClick={() => void handleOpenManage(classItem)}
                          >
                            Manage
                          </Button>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEdit(classItem)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDelete(classItem)}
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

      <Dialog open={formOpen} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>{editingClass ? "Edit Class" : "Create Class"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Class Name"
              name="class_name"
              value={formValues.class_name}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  class_name: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Section"
              name="section"
              value={formValues.section}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  section: event.target.value,
                }))
              }
              fullWidth
            />
            {formError ? <Alert severity="error">{formError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitLoading}
            startIcon={<SaveIcon />}
          >
            {editingClass ? "Save Changes" : "Create Class"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleCloseDelete} fullWidth maxWidth="xs">
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the class "{classToDelete?.class_name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
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

      <Dialog open={manageOpen} onClose={handleCloseManage} fullWidth maxWidth="md">
        <DialogTitle>
          Manage Class: {selectedClass?.class_name || ""}
          {selectedClass?.section ? ` — ${selectedClass.section}` : ""}
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            sx={{ mb: 2 }}
          >
            <Tab label="Teachers" value="teachers" />
            <Tab label="Students" value="students" />
          </Tabs>

          {tab === "teachers" ? (
            <Stack spacing={3}>
              <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#fafafa" }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Assign Teacher
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    select
                    label="Teacher"
                    value={selectedTeacherId}
                    onChange={(event) =>
                      handleTeacherSelection(Number(event.target.value))
                    }
                    fullWidth
                  >
                    <MenuItem value={0}>Select teacher</MenuItem>
                    {availableTeachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.name} — {teacher.subject || "No subject"}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Subject"
                    value={assignmentSubject}
                    onChange={(event) => setAssignmentSubject(event.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={handleAssignTeacher}
                    disabled={actionLoading || selectedTeacherId <= 0}
                  >
                    Assign
                  </Button>
                </Stack>
                {assignmentError ? (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {assignmentError}
                  </Alert>
                ) : null}
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Assigned Teachers
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Remove</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedClassTeacherAssignments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No teachers assigned yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedClassTeacherAssignments.map((assignment) => {
                          const teacher = teachers.find(
                            (item) => item.id === assignment.teacher_id,
                          );

                          return (
                            <TableRow key={assignment.id}>
                              <TableCell>{teacher?.name || "Unknown"}</TableCell>
                              <TableCell>{assignment.subject || "—"}</TableCell>
                              <TableCell>{teacher?.email || "—"}</TableCell>
                              <TableCell align="right">
                                <Button
                                  color="error"
                                  size="small"
                                  onClick={() => void handleRemoveTeacher(assignment.id)}
                                  disabled={actionLoading}
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#fafafa" }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Assign Student
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    select
                    label="Student"
                    value={selectedStudentId}
                    onChange={(event) =>
                      setSelectedStudentId(Number(event.target.value))
                    }
                    fullWidth
                  >
                    <MenuItem value={0}>Select student</MenuItem>
                    {availableStudents.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name} — {student.email}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={handleAssignStudent}
                    disabled={actionLoading || selectedStudentId <= 0}
                  >
                    Assign
                  </Button>
                </Stack>
                {assignmentError ? (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {assignmentError}
                  </Alert>
                ) : null}
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Class Students
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell align="right">Remove</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {actionLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                              <CircularProgress size={24} />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : classStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No students assigned to this class yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        classStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.course || "—"}</TableCell>
                            <TableCell align="right">
                              <Button
                                color="error"
                                size="small"
                                onClick={() => void handleRemoveStudent(student.id)}
                                disabled={actionLoading}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseManage}>Close</Button>
        </DialogActions>
      </Dialog>

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
