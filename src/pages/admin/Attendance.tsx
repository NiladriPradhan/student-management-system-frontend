import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
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
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import {
  markAttendance,
  updateAttendance,
  getAttendanceByDate,
} from "../../services/attendance.service";
import { getStudents } from "../../services/student.service";
import type { Student } from "../../types/student";

interface StudentAttendance extends Student {
  attendance_status: "present" | "absent" | "late" | "";
  attendance_id?: number;
}

export default function Attendance() {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const loadStudents = async (date: string) => {
    setLoading(true);

    try {
      const [studentsResponse, attendanceResponse] = await Promise.all([
        getStudents(),
        getAttendanceByDate(date),
      ]);

      // Create a map of student_id -> attendance record for quick lookup
      const attendanceMap = new Map(
        attendanceResponse.attendance.map((att) => [att.student_id, att]),
      );

      // Merge student data with attendance data
      const studentList: StudentAttendance[] = studentsResponse.students.map(
        (student) => {
          const attendance = attendanceMap.get(student.id);
          return {
            ...student,
            attendance_status: (attendance?.status || "") as
              | "present"
              | "absent"
              | "late"
              | "",
            attendance_id: attendance?.id,
          };
        },
      );

      setStudents(studentList);
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), "error");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStudents(selectedDate);
  }, [selectedDate]);

  const handleMarkAttendance = async (
    studentId: number,
    status: "present" | "absent" | "late",
  ) => {
    setSaving(true);

    try {
      await markAttendance({
        student_id: studentId,
        attendance_date: selectedDate,
        status,
        remarks: "",
      });

      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? { ...student, attendance_status: status }
            : student,
        ),
      );

      showSnackbar(
        `Marked ${status.substring(0, 1).toUpperCase() + status.substring(1)}.`,
      );
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (message.includes("already marked")) {
        // Already marked, try to update instead
        const student = students.find((s) => s.id === studentId);
        if (student && student.attendance_id) {
          try {
            await updateAttendance(student.attendance_id, {
              student_id: studentId,
              attendance_date: selectedDate,
              status,
              remarks: "",
            });

            setStudents((prev) =>
              prev.map((s) =>
                s.id === studentId ? { ...s, attendance_status: status } : s,
              ),
            );

            showSnackbar("Attendance updated.");
          } catch (updateError) {
            showSnackbar(getApiErrorMessage(updateError), "error");
          }
        }
      } else {
        showSnackbar(message, "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter(
    (s) => s.attendance_status === "present",
  ).length;
  const absentCount = students.filter(
    (s) => s.attendance_status === "absent",
  ).length;
  const lateCount = students.filter(
    (s) => s.attendance_status === "late",
  ).length;
  const markedCount = students.filter((s) => s.attendance_status !== "").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircleIcon sx={{ color: "#4caf50" }} />;
      case "absent":
        return <CancelIcon sx={{ color: "#f44336" }} />;
      case "late":
        return <CancelIcon sx={{ color: "#ff9800" }} />;
      default:
        return null;
    }
  };

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

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Attendance Management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Typography variant="body1" fontWeight={500}>
            Select Date:
          </Typography>
          <TextField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{ width: 200 }}
          />
          <Typography variant="body2" color="text.secondary">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ borderRadius: 3, boxShadow: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            src={student.profile_image}
                            alt={student.name}
                            sx={{ width: 32, height: 32 }}
                          >
                            {student.name.charAt(0)}
                          </Avatar>
                          {student.name}
                        </Box>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.attendance_status ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getStatusIcon(student.attendance_status)}
                            <Typography variant="body2">
                              {student.attendance_status.toUpperCase()}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not marked
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Button
                            size="small"
                            variant={
                              student.attendance_status === "present"
                                ? "contained"
                                : "outlined"
                            }
                            color="success"
                            onClick={() =>
                              handleMarkAttendance(student.id, "present")
                            }
                            disabled={saving}
                          >
                            Present
                          </Button>
                          <Button
                            size="small"
                            variant={
                              student.attendance_status === "absent"
                                ? "contained"
                                : "outlined"
                            }
                            color="error"
                            onClick={() =>
                              handleMarkAttendance(student.id, "absent")
                            }
                            disabled={saving}
                          >
                            Absent
                          </Button>
                          <Button
                            size="small"
                            variant={
                              student.attendance_status === "late"
                                ? "contained"
                                : "outlined"
                            }
                            color="warning"
                            onClick={() =>
                              handleMarkAttendance(student.id, "late")
                            }
                            disabled={saving}
                          >
                            Late
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {students.length}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Marked
                </Typography>
                <Typography variant="h4" fontWeight={600} color="primary.main">
                  {markedCount}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
                <Typography variant="h4" fontWeight={600} color="success.main">
                  {presentCount}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
                <Typography variant="h4" fontWeight={600} color="error.main">
                  {absentCount}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Late
                </Typography>
                <Typography variant="h4" fontWeight={600} color="warning.main">
                  {lateCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
