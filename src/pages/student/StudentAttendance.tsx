import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const attendanceData = [
  { subject: "Mathematics", total: 30, present: 27, absent: 3, percentage: 90 },
  { subject: "Physics", total: 25, present: 22, absent: 3, percentage: 88 },
  { subject: "English", total: 28, present: 26, absent: 2, percentage: 93 },
  {
    subject: "Computer Science",
    total: 20,
    present: 18,
    absent: 2,
    percentage: 90,
  },
];

const monthlyAttendance = [
  { date: "2024-01-01", status: "present", subject: "Mathematics" },
  { date: "2024-01-02", status: "present", subject: "Physics" },
  { date: "2024-01-03", status: "absent", subject: "English" },
  { date: "2024-01-04", status: "present", subject: "CS" },
  { date: "2024-01-05", status: "late", subject: "Mathematics" },
];

export default function StudentAttendance() {
  const overallAttendance =
    attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) /
    attendanceData.length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Attendance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Track your attendance records for each subject
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Overall Attendance
              </Typography>
              <Typography variant="h2" fontWeight={600} color="primary">
                {overallAttendance.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={overallAttendance}
                sx={{ height: 10, borderRadius: 5, mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Present Days
              </Typography>
              <Typography variant="h2" fontWeight={600} color="success.main">
                {attendanceData.reduce((acc, curr) => acc + curr.present, 0)}
              </Typography>
              <CheckCircleIcon sx={{ mt: 1, color: "#4caf50" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Absent Days
              </Typography>
              <Typography variant="h2" fontWeight={600} color="error.main">
                {attendanceData.reduce((acc, curr) => acc + curr.absent, 0)}
              </Typography>
              <CancelIcon sx={{ mt: 1, color: "#f44336" }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Attendance by Subject
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Present</TableCell>
                <TableCell align="center">Absent</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((item) => (
                <TableRow key={item.subject}>
                  <TableCell>
                    <Typography fontWeight={500}>{item.subject}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={item.present} size="small" color="success" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={item.absent} size="small" color="error" />
                  </TableCell>
                  <TableCell align="center">{item.total}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{ width: 100, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">
                        {item.percentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Attendance Records
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyAttendance.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        record.status === "present" ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )
                      }
                      label={record.status.toUpperCase()}
                      color={
                        record.status === "present"
                          ? "success"
                          : record.status === "late"
                            ? "warning"
                            : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
