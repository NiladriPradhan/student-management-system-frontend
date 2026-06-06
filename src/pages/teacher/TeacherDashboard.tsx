import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  EventAvailable as EventAvailableIcon,
  Message as MessageIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import {
  getTeacherDashboard,
  type TeacherDashboardData,
} from "../../services/dashboard";

const defaultDashboard: TeacherDashboardData = {
  stats: {
    total_classes: 0,
    total_students: 0,
    todays_classes: 0,
    attendance_marked_today: 0,
  },
  today_schedule: [],
  recent_messages: [],
  recent_resources: [],
};

const formatTime = (time: string) => {
  if (!time) {
    return "";
  }

  const [hours = "0", minutes = "00"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateTime = (dateTime: string) => {
  if (!dateTime) {
    return "";
  }

  return new Date(dateTime.replace(" ", "T")).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function TeacherDashboard() {
  const [dashboard, setDashboard] =
    useState<TeacherDashboardData>(defaultDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTeacherDashboard();

        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        if (mounted) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Total Classes",
        value: dashboard.stats.total_classes,
        icon: <SchoolIcon />,
        color: "#2196f3",
        bgColor: "#e3f2fd",
      },
      {
        title: "Total Students",
        value: dashboard.stats.total_students,
        icon: <PeopleIcon />,
        color: "#2e7d32",
        bgColor: "#e8f5e9",
      },
      {
        title: "Today's Classes",
        value: dashboard.stats.todays_classes,
        icon: <EventAvailableIcon />,
        color: "#ed6c02",
        bgColor: "#fff3e0",
      },
      {
        title: "Attendance Marked Today",
        value: dashboard.stats.attendance_marked_today,
        icon: <CheckCircleIcon />,
        color: "#9c27b0",
        bgColor: "#f3e5f5",
      },
    ],
    [dashboard.stats],
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Teacher Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Your dashboard now reflects your assigned classes.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
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
                    {loading ? (
                      <Skeleton width={64} height={44} />
                    ) : (
                      <Typography variant="h4" fontWeight={600}>
                        {stat.value}
                      </Typography>
                    )}
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
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight={600}>
                Today's Schedule
              </Typography>
              <Button
                component={RouterLink}
                to="/teacher/schedule"
                variant="outlined"
                size="small"
              >
                View Full Schedule
              </Button>
            </Stack>

            {loading ? (
              <Stack alignItems="center" sx={{ py: 5 }}>
                <CircularProgress />
              </Stack>
            ) : dashboard.today_schedule.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4 }}>
                No classes scheduled for today.
              </Typography>
            ) : (
              <List disablePadding>
                {dashboard.today_schedule.map((schedule, index) => (
                  <Box key={schedule.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        px: 0,
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#2196f3" }}>
                          <ScheduleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={600}>
                            {schedule.subject}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              Class {schedule.class_name} • Section{" "}
                              {schedule.section}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(schedule.start_time)} -{" "}
                              {formatTime(schedule.end_time)} •{" "}
                              {schedule.room_number || "Room not assigned"}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Button
                        component={RouterLink}
                        to="/teacher/attendance"
                        variant="outlined"
                        size="small"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        Mark Attendance
                      </Button>
                    </ListItem>
                    {index < dashboard.today_schedule.length - 1 && (
                      <Divider component="li" />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Messages
              </Typography>
              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} height={42} />
                  ))}
                </Stack>
              ) : dashboard.recent_messages.length === 0 ? (
                <Typography color="text.secondary">
                  No recent messages yet.
                </Typography>
              ) : (
                <List disablePadding>
                  {dashboard.recent_messages.map((message, index) => (
                    <Box key={message.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                            <MessageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.subject}
                          secondary={`${message.class_name} ${message.section} • ${formatDateTime(
                            message.created_at,
                          )}`}
                        />
                      </ListItem>
                      {index < dashboard.recent_messages.length - 1 && (
                        <Divider component="li" />
                      )}
                    </Box>
                  ))}
                </List>
              )}
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Resources
              </Typography>
              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} height={42} />
                  ))}
                </Stack>
              ) : dashboard.recent_resources.length === 0 ? (
                <Typography color="text.secondary">
                  No study materials uploaded yet.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {dashboard.recent_resources.map((resource) => (
                    <Box key={resource.id}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: "#fff3e0", color: "#ed6c02" }}>
                          <DescriptionIcon />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {resource.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.class_name} {resource.section} •{" "}
                            {formatDateTime(resource.created_at)}
                          </Typography>
                        </Box>
                        <Chip
                          label={resource.file_type || "File"}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    component={RouterLink}
                    to="/teacher/attendance"
                    variant="outlined"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                  >
                    Mark Attendance
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    component={RouterLink}
                    to="/teacher/students"
                    variant="outlined"
                    fullWidth
                    startIcon={<PeopleIcon />}
                  >
                    View Students
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    component={RouterLink}
                    to="/teacher/resources"
                    variant="outlined"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                  >
                    Upload Resource
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    component={RouterLink}
                    to="/teacher/messages"
                    variant="outlined"
                    fullWidth
                    startIcon={<MessageIcon />}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
