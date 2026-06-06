import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import type { Teacher } from "../../types/teacher";

interface TeacherTableProps {
  teachers: Teacher[];
  loading?: boolean;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

/**
 * Format employment type to display friendly text
 */
const formatEmploymentType = (type: string): string => {
  return type === "full_time" ? "Full-time" : "Part-time";
};

/**
 * Format date string to readable format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function TeacherTable({
  teachers,
  loading = false,
  onEdit,
  onDelete,
}: TeacherTableProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (teachers.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <PersonIcon sx={{ fontSize: 48, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          No teachers found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Employment Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow
              key={teacher.id}
              sx={{
                "&:hover": { bgcolor: "#f9f9f9" },
                borderBottom: "1px solid #eee",
              }}
            >
              <TableCell>{teacher.id}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={teacher.profile_image}
                    alt={teacher.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    {teacher.name.charAt(0)}
                  </Avatar>
                  {teacher.name}
                </Box>
              </TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.phone}</TableCell>
              <TableCell>{teacher.subject}</TableCell>
              <TableCell>
                {formatEmploymentType(teacher.employment_type)}
              </TableCell>
              <TableCell>{teacher.gender}</TableCell>
              <TableCell>{formatDate(teacher.created_at)}</TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(teacher)}
                  title="Edit teacher"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(teacher)}
                  title="Delete teacher"
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
