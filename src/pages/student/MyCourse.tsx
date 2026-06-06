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
} from "@mui/material";
import {
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

const courses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH301",
    instructor: "Prof. Robert Smith",
    schedule: "Mon, Wed 10:00 AM",
    progress: 75,
    credits: 3,
    grade: "A",
  },
  {
    id: 2,
    name: "Physics: Mechanics",
    code: "PHYS201",
    instructor: "Dr. Emily Johnson",
    schedule: "Tue, Thu 12:00 PM",
    progress: 60,
    credits: 4,
    grade: "B+",
  },
  {
    id: 3,
    name: "English Literature",
    code: "ENG150",
    instructor: "Prof. Sarah Williams",
    schedule: "Mon, Wed 2:00 PM",
    progress: 90,
    credits: 3,
    grade: "A-",
  },
  {
    id: 4,
    name: "Computer Science",
    code: "CS101",
    instructor: "Dr. Michael Brown",
    schedule: "Fri 9:00 AM",
    progress: 45,
    credits: 3,
    grade: "B",
  },
];

export default function MyCourses() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Courses
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage and track your enrolled courses
      </Typography>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid size={{ xs: 12, md: 4 }} key={course.id}>
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
                    <Avatar sx={{ bgcolor: "#667eea", width: 56, height: 56 }}>
                      <BookIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.code}
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
                    <Typography variant="body2">{course.instructor}</Typography>
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
                    <Typography variant="body2">{course.schedule}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {course.credits} Credits
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
                      {course.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Button variant="outlined" fullWidth>
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
