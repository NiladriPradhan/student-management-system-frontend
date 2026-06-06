import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import type { Student } from "../../types/student";

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
};

export default function StudentTable({
  students,
  loading,
  onEdit,
  onDelete,
}: StudentTableProps) {
  return (
    <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
      <TableContainer sx={{ minHeight: 320 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ py: 8 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">
                      Loading students...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Alert severity="info" sx={{ my: 2 }}>
                    No students found
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: "#1976d2", width: 34, height: 34 }}>
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {student.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{student.email || "-"}</TableCell>
                  <TableCell>{student.phone || "-"}</TableCell>
                  <TableCell>{student.course || "-"}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {student.gender || "-"}
                  </TableCell>
                  <TableCell>{formatDate(student.created_at)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit student">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(student)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete student">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(student)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
