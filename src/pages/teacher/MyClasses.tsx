import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { getTeacherAssignments } from "../../services/classes.service";
import { getApiErrorMessage } from "../../services/api";
import type { TeacherAssignment } from "../../types/classes";
import { Link } from "react-router-dom";

export default function TeacherClasses() {
  const [classes, setClasses] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      setError(null);

      try {
        const assignedClasses = await getTeacherAssignments();
        setClasses(assignedClasses);
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError));
      } finally {
        setLoading(false);
      }
    };

    void loadClasses();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Classes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your classes, track progress, and view student information.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography color="text.secondary">
            There was a problem loading your assigned classes. Please refresh
            the page.
          </Typography>
        </Box>
      ) : classes.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No classes assigned
          </Typography>
          <Typography color="text.secondary">
            It looks like you do not have any classes assigned yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {classes.map((classItem) => (
            <Grid size={{ xs: 12, md: 6 }} key={classItem.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#2196f3", width: 56, height: 56 }}
                      >
                        <SchoolIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {classItem.class_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Section {classItem.section}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`Subject: ${classItem.subject || "N/A"}`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <PeopleIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        Total students: {classItem.total_students ?? "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Link
                      to={`/teacher/students?class_id=${classItem.class_id || classItem.id}`}
                    >
                      <Button variant="contained" fullWidth size="small">
                        View Students
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() =>
                        (window.location.href = `/teacher/attendance?class_id=${classItem.class_id || classItem.id}`)
                      }
                    >
                      Take Attendance
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
