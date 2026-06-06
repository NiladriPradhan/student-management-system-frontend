import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Attendance } from "../../types/attendance";

interface AttendanceTableProps {
  attendance: Attendance[];
  loading?: boolean;
  onEdit: (record: Attendance) => void;
  onDelete: (record: Attendance) => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case "present":
      return "success";
    case "absent":
      return "error";
    case "late":
      return "warning";
    default:
      return "default";
  }
};

export default function AttendanceTable({
  attendance,
  loading = false,
  onEdit,
  onDelete,
}: AttendanceTableProps) {
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (attendance.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Avatar sx={{ bgcolor: "primary.light", width: 56, height: 56 }}>
          A
        </Avatar>
        <Typography variant="h6">No attendance records found</Typography>
        <Typography variant="body2">
          Use the date filter or student search to load attendance.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.map((record) => (
            <TableRow
              key={record.id}
              sx={{
                "&:hover": { bgcolor: "#fafafa" },
              }}
            >
              <TableCell>{record.id}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {record.student_name.charAt(0) || record.student_id}
                  </Avatar>
                  <Box>
                    <Typography>{record.student_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {record.student_id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{record.attendance_date}</TableCell>
              <TableCell>
                <Chip
                  label={record.status.toUpperCase()}
                  color={statusColor(record.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{record.remarks || "—"}</TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(record)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(record)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
