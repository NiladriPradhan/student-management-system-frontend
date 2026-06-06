import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { getTeacherStudents } from "../../services/classes.service";
import { getApiErrorMessage } from "../../services/api";
import type { Student } from "../../types/student";

export default function TeacherStudents() {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const classId = searchParams.get("class_id");
  console.log("====================================");
  console.log(selectedStudent);
  console.log("====================================");
  // Load students on mount or when class_id changes
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Student[] = [];

        if (classId) {
          const parsedClassId = Number(classId);
          console.log("Loading students for class_id:", parsedClassId);
          if (parsedClassId > 0) {
            data = await getTeacherStudents(parsedClassId);
            console.log("Received students:", data);
          }
        } else {
          console.log("Loading all teacher students");
          data = await getTeacherStudents();
          console.log("Received students:", data);
        }

        setStudents(data);
        setFilteredStudents(data);
      } catch (fetchError) {
        const errorMsg = getApiErrorMessage(fetchError);
        console.error("Error loading students:", errorMsg, fetchError);
        setError(errorMsg);
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };

    void loadStudents();
  }, [classId]);

  // Filter students on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredStudents(students);
      return;
    }

    const keyword = search.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.enrollment_number?.toLowerCase().includes(keyword) ||
        student.roll_no?.toLowerCase().includes(keyword),
    );

    setFilteredStudents(filtered);
  }, [search, students]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    student: Student,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Students
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        View and manage all students across your assigned classes.
      </Typography>

      {error && (
        <Paper sx={{ p: 2, bgcolor: "#ffebee", mb: 3, borderRadius: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search by name, email, or enrollment number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <Button variant="outlined" startIcon={<FilterListIcon />}>
            Filter
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              {students.length === 0
                ? "No students found"
                : "No students match your search"}
            </Typography>
            <Typography color="text.secondary">
              {students.length === 0
                ? classId
                  ? "This class has no students assigned yet."
                  : "You do not have any students assigned to your classes yet."
                : "Try adjusting your search criteria."}
            </Typography>
            {classId && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block" }}
              >
                Class ID: {classId}
              </Typography>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Enrollment / Roll No</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{ bgcolor: "#2196f3", width: 32, height: 32 }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {student.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.enrollment_number || student.roll_no || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{student.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.phone || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.class_name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.section || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.subject || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          (window.location.href = `mailto:${student.email}`)
                        }
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, student)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>View Grades</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Attendance</MenuItem>
        <MenuItem onClick={handleMenuClose}>Send Message</MenuItem>
      </Menu>
    </Box>
  );
}
