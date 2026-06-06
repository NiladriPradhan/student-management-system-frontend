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
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const gradeData = [
  {
    subject: "Mathematics",
    assignments: 85,
    midterm: 88,
    final: 92,
    overall: 88.3,
    grade: "B+",
  },
  {
    subject: "Physics",
    assignments: 78,
    midterm: 82,
    final: 85,
    overall: 81.7,
    grade: "B",
  },
  {
    subject: "English",
    assignments: 92,
    midterm: 88,
    final: 94,
    overall: 91.3,
    grade: "A-",
  },
  {
    subject: "Computer Science",
    assignments: 88,
    midterm: 85,
    final: 90,
    overall: 87.7,
    grade: "B+",
  },
];

const recentGrades = [
  {
    id: 1,
    subject: "Mathematics",
    assignment: "Quiz 1",
    score: 95,
    date: "2024-01-10",
  },
  {
    id: 2,
    subject: "Physics",
    assignment: "Lab Report",
    score: 82,
    date: "2024-01-08",
  },
  {
    id: 3,
    subject: "English",
    assignment: "Essay",
    score: 88,
    date: "2024-01-05",
  },
  {
    id: 4,
    subject: "CS",
    assignment: "Project",
    score: 90,
    date: "2024-01-03",
  },
];

export default function StudentGrades() {
  const overallGPA =
    gradeData.reduce((acc, curr) => acc + curr.overall, 0) / gradeData.length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Grades
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Track your academic performance across all subjects
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Overall GPA
              </Typography>
              <Typography variant="h2" fontWeight={600} color="primary">
                {overallGPA.toFixed(1)}%
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUpIcon
                  sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
                />
                <Typography variant="caption" color="success.main">
                  +2.5% from last semester
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Highest Grade
              </Typography>
              <Typography variant="h2" fontWeight={600} color="success.main">
                A-
              </Typography>
              <Typography variant="caption" color="text.secondary">
                English Literature
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Credits Earned
              </Typography>
              <Typography variant="h2" fontWeight={600} color="info.main">
                42
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Credits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Grade Summary by Subject
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Assignments</TableCell>
                <TableCell align="center">Midterm</TableCell>
                <TableCell align="center">Final</TableCell>
                <TableCell align="center">Overall</TableCell>
                <TableCell align="center">Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradeData.map((item) => (
                <TableRow key={item.subject}>
                  <TableCell>
                    <Typography fontWeight={500}>{item.subject}</Typography>
                  </TableCell>
                  <TableCell align="center">{item.assignments}%</TableCell>
                  <TableCell align="center">{item.midterm}%</TableCell>
                  <TableCell align="center">{item.final}%</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.overall}
                        sx={{ width: 80, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">{item.overall}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={item.grade} color="primary" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Grades
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>Assignment</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GradeIcon sx={{ color: "#ff9800" }} />
                      <Typography fontWeight={500}>
                        {grade.assignment}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{grade.subject}</TableCell>
                  <TableCell>{grade.date}</TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {grade.score}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        grade.score >= 90
                          ? "Excellent"
                          : grade.score >= 80
                            ? "Good"
                            : "Average"
                      }
                      color={
                        grade.score >= 90
                          ? "success"
                          : grade.score >= 80
                            ? "info"
                            : "warning"
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
