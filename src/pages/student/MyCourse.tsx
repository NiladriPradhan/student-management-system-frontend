import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { getMyCourses } from "../../services/classes.service";
import type { Class } from "../../types/classes";

export default function MyCourse() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyCourses();
        if (mounted) setCourses(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load courses");
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

  return (
    <Box>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid key={course.id} size={{ xs: 12, md: 6 }}>
            <Card>
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
                    <Avatar sx={{ bgcolor: "#667eea", width: 56, height: 56 }}>
                      <BookIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {course.class_name || `Class ${course.id}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.section || ""}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`Grade: ${course.grade}`}
                    color={course.grade === "A" ? "success" : "primary"}
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
                    <PersonIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {(course as any).instructor || "-"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <ScheduleIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {(course as any).schedule || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {(course as any).credits ?? "-"} Credits
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Course Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {(course as any).progress ?? 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(course as any).progress ?? 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/student/my-course/${course.id}`)}
                >
                  View Course Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
