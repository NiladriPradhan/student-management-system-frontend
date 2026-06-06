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
} from "@mui/material";
import {
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const stats = [
  {
    title: "Enrolled Courses",
    value: "6",
    icon: <BookIcon />,
    color: "#667eea",
    bgColor: "#e8eaf6",
    trend: "+2 this semester",
  },
  {
    title: "Completed Assignments",
    value: "12",
    icon: <AssignmentIcon />,
    color: "#2e7d32",
    bgColor: "#e8f5e9",
    trend: "85% completion",
  },
  {
    title: "Overall GPA",
    value: "3.8",
    icon: <GradeIcon />,
    color: "#ed6c02",
    bgColor: "#fff3e0",
    trend: "A- Average",
  },
  {
    title: "Attendance",
    value: "92%",
    icon: <CalendarIcon />,
    color: "#9c27b0",
    bgColor: "#f3e5f5",
    trend: "Excellent",
  },
];

const upcomingClasses = [
  {
    id: 1,
    subject: "Mathematics",
    time: "10:00 AM - 11:30 AM",
    room: "Room 201",
    teacher: "Prof. Smith",
  },
  {
    id: 2,
    subject: "Physics",
    time: "12:00 PM - 1:30 PM",
    room: "Lab 3",
    teacher: "Dr. Johnson",
  },
  {
    id: 3,
    subject: "English Literature",
    time: "2:00 PM - 3:30 PM",
    room: "Room 105",
    teacher: "Prof. Williams",
  },
];

const recentGrades = [
  {
    id: 1,
    subject: "Mathematics",
    assignment: "Calculus Quiz",
    grade: "A",
    score: 92,
    date: "2 days ago",
  },
  {
    id: 2,
    subject: "Physics",
    assignment: "Lab Report",
    grade: "B+",
    score: 85,
    date: "5 days ago",
  },
  {
    id: 3,
    subject: "English",
    assignment: "Essay",
    grade: "A-",
    score: 88,
    date: "1 week ago",
  },
];

export default function StudentDashboard() {
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
              {upcomingClasses.map((cls, index) => (
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
                            {cls.time}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cls.room} • {cls.teacher}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < upcomingClasses.length - 1 && (
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
              Recent Grades
            </Typography>
            <List>
              {recentGrades.map((grade, index) => (
                <Box key={grade.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: grade.grade === "A" ? "#4caf50" : "#ff9800",
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
                            {grade.subject}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                          >
                            {grade.grade}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption">
                            {grade.assignment} • Score: {grade.score}%
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {grade.date}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentGrades.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              View All Grades
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
