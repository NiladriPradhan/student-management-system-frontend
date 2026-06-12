import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../services/dashboard";
import type { StudentDashboardData } from "../../services/dashboard";


// Student dashboard will be loaded from the server

export default function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getStudentDashboard();
        if (mounted) {
          setData(resp);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load dashboard");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error ?? "No data available"}
        </Typography>
      </Box>
    );
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: String(data.stats.enrolled_courses),
      icon: <BookIcon />,
      color: "#667eea",
      bgColor: "#e8eaf6",
      trend: "",
    },
    {
      title: "Completed Assignments",
      value: String(data.stats.completed_assignments),
      icon: <AssignmentIcon />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
      trend: "",
    },
    {
      title: "Overall GPA",
      value: "-",
      icon: <GradeIcon />,
      color: "#ed6c02",
      bgColor: "#fff3e0",
      trend: "",
    },
    {
      title: "Attendance",
      value: `${data.stats.attendance_percentage}%`,
      icon: <CalendarIcon />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
      trend: "",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Track your academic progress and upcoming activities.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <TrendingUpIcon
                        sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
                      />
                      <Typography variant="caption" color="success.main">
                        {stat.trend}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Today's Schedule
            </Typography>
            <List>
              {data.today_schedule.map((cls, index) => (
                <Box key={cls.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#667eea" }}>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {cls.subject}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" display="block">
                            {`${cls.start_time} - ${cls.end_time}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cls.class_name} • {cls.teacher_name}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < data.today_schedule.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              View Full Schedule
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Submissions
            </Typography>
            <List>
              {data.recent_submissions.map((item, index) => (
                <Box key={item.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            item.status === "submitted" ? "#4caf50" : "#ff9800",
                        }}
                      >
                        <GradeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body1" fontWeight={500}>
                            {item.assignment_title}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                          >
                            {item.status}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption">
                            {item.class_name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {item.submitted_at
                              ? new Date(item.submitted_at).toLocaleString()
                              : "-"}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < data.recent_submissions.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              View All Submissions
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Academic Progress
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mathematics
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="caption">85% - A Grade</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Physics
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={78}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="caption">78% - B+ Grade</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  English
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="caption">92% - A Grade</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
