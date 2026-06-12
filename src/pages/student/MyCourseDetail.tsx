import { Box, Typography, Card, CardContent, Avatar, Button, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Book as BookIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getMyCourses } from "../../services/classes.service";
import type { Class } from "../../types/classes";

export default function MyCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Class | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const list = await getMyCourses();
        const courseId = Number(id);
        const found = list.find((c) => Number(c.id) === courseId);
        if (mounted) setCourse(found ?? null);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load course");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!course)
    return (
      <Box>
        <Typography variant="h5">Course not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/student/my-course')}>
          Back to Courses
        </Button>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {course.class_name}
      </Typography>
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#667eea', width: 72, height: 72 }}>
              <BookIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{course.section}</Typography>
              <Typography variant="body2" color="text.secondary">
                {course.created_at}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            Class ID: {course.id}
          </Typography>

          <Button sx={{ mt: 2 }} onClick={() => navigate('/student/my-course')}>
            Back to Courses
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
