import { useEffect, useEffectEvent, useMemo, useState } from "react";
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
  EventNote as EventNoteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import ScheduleForm from "../../components/schedules/ScheduleForm";
import ScheduleTable from "../../components/schedules/ScheduleTable";
import { getApiErrorMessage } from "../../services/api";
import { getClasses } from "../../services/classes.service";
import {
  createAdminSchedule,
  deleteAdminSchedule,
  getAdminSchedules,
  updateAdminSchedule,
} from "../../services/scheduleService";
import { getTeachers } from "../../services/teacher.service";
import type { Class as SchoolClass } from "../../types/classes";
import type { ClassSchedule, ScheduleFormValues } from "../../types/schedule";
import type { Teacher } from "../../types/teacher";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState(0);
  const [classFilter, setClassFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<ClassSchedule | null>(null);
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
      const [scheduleList, teacherList, classList] = await Promise.all([
        getAdminSchedules({
          teacher_id: teacherFilter || undefined,
          class_id: classFilter || undefined,
        }),
        getTeachers(),
        getClasses(),
      ]);

      setSchedules(scheduleList);
      setTeachers(teacherList.teachers);
      setClasses(classList.classes);
    } catch (loadError) {
      const message = getApiErrorMessage(loadError);
      setError(message);
      setSchedules([]);
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
  }, [teacherFilter, classFilter]);

  const filteredSchedules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return schedules;
    }

    return schedules.filter((schedule) =>
      [
        schedule.teacher_name,
        schedule.subject,
        schedule.class_name,
        schedule.section,
        schedule.day_of_week,
        schedule.room_number,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [schedules, search]);

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setFormError("");
    setFormOpen(true);
  };

  const handleOpenEdit = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    setFormError("");
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSchedule(null);
    setFormError("");
  };

  const handleSubmit = async (values: ScheduleFormValues) => {
    setSubmitLoading(true);
    setFormError("");

    try {
      if (editingSchedule) {
        await updateAdminSchedule({
          id: editingSchedule.id,
          ...values,
        });
        showSnackbar("Schedule Updated");
      } else {
        await createAdminSchedule(values);
        showSnackbar("Schedule Created");
      }

      handleCloseForm();
      await loadData();
    } catch (submitError) {
      const message = getApiErrorMessage(submitError);
      setFormError(message);
      showSnackbar(message, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDelete = (schedule: ClassSchedule) => {
    setScheduleToDelete(schedule);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setScheduleToDelete(null);
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) {
      return;
    }

    setSubmitLoading(true);

    try {
      await deleteAdminSchedule(scheduleToDelete.id);
      showSnackbar("Schedule Deleted");
      handleCloseDelete();
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
            <EventNoteIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>
              Schedule Management
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create and manage teacher class schedules from one place.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void loadData()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add Schedule
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            placeholder="Search by teacher, subject, class, day, room..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 260 }}
          />
          <TextField
            select
            label="Filter by teacher"
            value={teacherFilter}
            onChange={(event) => setTeacherFilter(Number(event.target.value))}
            sx={{ minWidth: { xs: "100%", md: 220 } }}
          >
            <MenuItem value={0}>All teachers</MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter by class"
            value={classFilter}
            onChange={(event) => setClassFilter(Number(event.target.value))}
            sx={{ minWidth: { xs: "100%", md: 220 } }}
          >
            <MenuItem value={0}>All classes</MenuItem>
            {classes.map((classItem) => (
              <MenuItem key={classItem.id} value={classItem.id}>
                {classItem.class_name}
                {classItem.section ? ` - ${classItem.section}` : ""}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <ScheduleTable
          schedules={filteredSchedules}
          loading={loading}
          onAdd={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </Paper>

      {formOpen ? (
        <ScheduleForm
          open={formOpen}
          schedule={editingSchedule}
          teachers={teachers}
          classes={classes}
          loading={submitLoading}
          errorMessage={formError}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      ) : null}

      <Dialog open={deleteOpen} onClose={handleCloseDelete} fullWidth maxWidth="xs">
        <DialogTitle>Delete Schedule</DialogTitle>
        <DialogContent>
          <Typography>
            Delete {scheduleToDelete?.subject || "this schedule"} for{" "}
            {scheduleToDelete?.teacher_name || "this teacher"}?
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
