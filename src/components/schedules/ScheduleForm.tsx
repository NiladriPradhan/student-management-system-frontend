import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { Class as SchoolClass } from "../../types/classes";
import type { ClassSchedule, ScheduleFormValues } from "../../types/schedule";
import type { Teacher } from "../../types/teacher";

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialValues: ScheduleFormValues = {
  teacher_id: 0,
  class_id: 0,
  subject: "",
  day_of_week: "",
  start_time: "",
  end_time: "",
  room_number: "",
};

const toTimeInputValue = (value: string) => value?.slice(0, 5) ?? "";

const getInitialValues = (
  schedule: ClassSchedule | null,
): ScheduleFormValues => {
  if (!schedule) {
    return initialValues;
  }

  return {
    teacher_id: schedule.teacher_id,
    class_id: schedule.class_id,
    subject: schedule.subject,
    day_of_week: String(schedule.day_of_week),
    start_time: toTimeInputValue(schedule.start_time),
    end_time: toTimeInputValue(schedule.end_time),
    room_number: schedule.room_number,
  };
};

type ScheduleFormProps = {
  open: boolean;
  schedule: ClassSchedule | null;
  teachers: Teacher[];
  classes: SchoolClass[];
  loading: boolean;
  errorMessage: string;
  onClose: () => void;
  onSubmit: (values: ScheduleFormValues) => void;
};

export default function ScheduleForm({
  open,
  schedule,
  teachers,
  classes,
  loading,
  errorMessage,
  onClose,
  onSubmit,
}: ScheduleFormProps) {
  const [values, setValues] = useState<ScheduleFormValues>(() =>
    getInitialValues(schedule),
  );
  const [validationError, setValidationError] = useState("");

  const handleChange = (
    field: keyof ScheduleFormValues,
    value: string | number,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const normalizedValues: ScheduleFormValues = {
      teacher_id: Number(values.teacher_id),
      class_id: Number(values.class_id),
      subject: values.subject.trim(),
      day_of_week: values.day_of_week,
      start_time: values.start_time,
      end_time: values.end_time,
      room_number: values.room_number.trim(),
    };

    if (
      !normalizedValues.teacher_id ||
      !normalizedValues.class_id ||
      !normalizedValues.subject ||
      !normalizedValues.day_of_week ||
      !normalizedValues.start_time ||
      !normalizedValues.end_time ||
      !normalizedValues.room_number
    ) {
      setValidationError("All fields are required.");
      return;
    }

    if (normalizedValues.end_time <= normalizedValues.start_time) {
      setValidationError("End time must be after start time.");
      return;
    }

    setValidationError("");
    onSubmit(normalizedValues);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{schedule ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Teacher"
            value={values.teacher_id}
            onChange={(event) =>
              handleChange("teacher_id", Number(event.target.value))
            }
            fullWidth
            required
          >
            <MenuItem value={0}>Select teacher</MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Class"
            value={values.class_id}
            onChange={(event) =>
              handleChange("class_id", Number(event.target.value))
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
            label="Subject"
            value={values.subject}
            onChange={(event) => handleChange("subject", event.target.value)}
            fullWidth
            required
          />

          <TextField
            select
            label="Day of Week"
            value={values.day_of_week}
            onChange={(event) => handleChange("day_of_week", event.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">Select day</MenuItem>
            {dayOptions.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Start Time"
              type="time"
              value={values.start_time}
              onChange={(event) => handleChange("start_time", event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="End Time"
              type="time"
              value={values.end_time}
              onChange={(event) => handleChange("end_time", event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Stack>

          <TextField
            label="Room Number"
            value={values.room_number}
            onChange={(event) => handleChange("room_number", event.target.value)}
            fullWidth
            required
          />

          {validationError ? <Alert severity="error">{validationError}</Alert> : null}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {schedule ? "Update Schedule" : "Create Schedule"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
