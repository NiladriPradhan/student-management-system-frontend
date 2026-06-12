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
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getMyAttendance } from "../../services/attendance.service";
import type { Attendance } from "../../types/attendance";

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getMyAttendance();
        if (mounted) setAttendance(res.attendance);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load attendance");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  // Aggregate by subject (class_name)
  const bySubject = attendance.reduce<
    Record<string, { present: number; absent: number; late: number }>
  >((acc, rec) => {
    const subject = (rec as any).class_name || `Class ${(rec as any).class_id}`;
    acc[subject] = acc[subject] || { present: 0, absent: 0, late: 0 };
    if (rec.status === "absent") acc[subject].absent += 1;
    else if (rec.status === "late") acc[subject].late += 1;
    else acc[subject].present += 1;
    return acc;
  }, {});

  const attendanceData = Object.entries(bySubject).map(([subject, stats]) => {
    const total = stats.present + stats.absent + stats.late;
    const percentage =
      total > 0 ? Math.round((stats.present / total) * 100) : 0;
    return {
      subject,
      total,
      present: stats.present,
      absent: stats.absent,
      percentage,
    };
  });

  const recent = attendance
    .slice(0, 10)
    .map((r) => ({
      date: r.attendance_date,
      status: r.status,
      subject: (r as any).class_name || `Class ${r.class_id}`,
    }));

  const overallAttendance =
    attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) /
    Math.max(attendanceData.length, 1);

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
                {attendance.filter((a) => a.status === "present").length}
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
                {attendance.filter((a) => a.status === "absent").length}
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
              {recent.map((record, index) => (
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
