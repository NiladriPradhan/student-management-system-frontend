import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import type { ClassSchedule } from "../../types/schedule";

type ScheduleTableProps = {
  schedules: ClassSchedule[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (schedule: ClassSchedule) => void;
  onDelete: (schedule: ClassSchedule) => void;
};

const formatTime = (time: string) => time?.slice(0, 5) || "--:--";

export default function ScheduleTable({
  schedules,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: ScheduleTableProps) {
  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Teacher Name",
                "Subject",
                "Class Name",
                "Section",
                "Day",
                "Time",
                "Room Number",
                "Actions",
              ].map((label) => (
                <TableCell key={label}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton height={28} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (schedules.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No schedules found
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Create the first schedule to assign a class session to a teacher.
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
          Add Schedule
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Teacher Name</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Class Name</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Day</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Room Number</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id} hover>
              <TableCell>{schedule.teacher_name || "Unknown teacher"}</TableCell>
              <TableCell>{schedule.subject}</TableCell>
              <TableCell>{schedule.class_name || "Unknown class"}</TableCell>
              <TableCell>{schedule.section || "N/A"}</TableCell>
              <TableCell>{schedule.day_of_week}</TableCell>
              <TableCell>
                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
              </TableCell>
              <TableCell>{schedule.room_number}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onEdit(schedule)}
                    aria-label="Edit schedule"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(schedule)}
                    aria-label="Delete schedule"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
