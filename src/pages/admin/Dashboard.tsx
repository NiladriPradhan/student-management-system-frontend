import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../services/api";
import { getProfile } from "../../services/auth.service";
import { getStudents } from "../../services/student.service";
import type { AuthUser } from "../../types/auth";
import type { Student } from "../../types/student";

const formatDate = (value?: string) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString();
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, studentResponse] = await Promise.all([
          getProfile(),
          getStudents(),
        ]);

        setProfile(profileResponse.data);
        setStudents(studentResponse.students);
      } catch (error) {
        setError(getApiErrorMessage(error));
      }
      finally {
        setLoading(false);
      }
    };

    void loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: String(students.length),
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
      trend: "Live",
    },
    {
      title: "Admin User",
      value: profile?.username ?? "Admin",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
      trend: profile?.role ?? "user",
    },
    {
      title: "Student Records",
      value: `${students.filter((student) => student.gender).length}`,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      bgColor: "#fff3e0",
      trend: "Synced",
    },
    {
      title: "Latest Student ID",
      value: students[0] ? `#${students[0].id}` : "-",
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
      trend: "Recent",
    },
  ];

  const recentActivities = students.slice(0, 4).map((student) => ({
    id: student.id,
    action: "New student record available",
    user: student.name,
    time: formatDate(student.created_at),
  }));

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back{profile ? `, ${profile.username}` : ""}! Here's what's
        happening with your school today.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat) => (
              <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" fontWeight={600} noWrap>
                          {stat.value}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
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
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Recent Student Activity
                  </Typography>
                  {recentActivities.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No recent student records found.
                    </Typography>
                  ) : (
                    recentActivities.map((activity) => (
                      <Box
                        key={activity.id}
                        sx={{ mb: 2, pb: 2, borderBottom: "1px solid #eee" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {activity.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              by {activity.user}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/admin/students")}
                  >
                    View Student Records
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Attendance Overview
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Student records synced from the backend
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
                    <Typography variant="h3" fontWeight={600}>
                      {students.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      records
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(students.length > 0 ? 100 : 0, 100)}
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Live backend connection is active for student data.
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Quick Actions
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mb: 1.5 }}
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate("/admin/students")}
                  >
                    Add New Student
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 1.5 }}
                    startIcon={<PeopleIcon />}
                  >
                    Add New Teacher
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    onClick={() => navigate("/admin/students")}
                  >
                    Manage Students
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
