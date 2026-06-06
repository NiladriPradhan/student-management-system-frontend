import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

const attendanceReport = [
  { student: "John Doe", present: 28, absent: 2, percentage: 93 },
  { student: "Jane Smith", present: 26, absent: 4, percentage: 87 },
  { student: "Mike Johnson", present: 29, absent: 1, percentage: 97 },
  { student: "Sarah Williams", present: 25, absent: 5, percentage: 83 },
  { student: "David Brown", present: 27, absent: 3, percentage: 90 },
];

const gradeReport = [
  { student: "John Doe", assignments: 85, midterm: 88, final: 92, average: 88 },
  {
    student: "Jane Smith",
    assignments: 92,
    midterm: 90,
    final: 94,
    average: 92,
  },
  {
    student: "Mike Johnson",
    assignments: 78,
    midterm: 82,
    final: 85,
    average: 82,
  },
  {
    student: "Sarah Williams",
    assignments: 95,
    midterm: 92,
    final: 96,
    average: 94,
  },
  {
    student: "David Brown",
    assignments: 88,
    midterm: 85,
    final: 90,
    average: 88,
  },
];

export default function TeacherReports() {
  const [reportType, setReportType] = useState("attendance");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Generate Reports
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="attendance">Attendance Report</MenuItem>
                <MenuItem value="grades">Grades Report</MenuItem>
                <MenuItem value="performance">Performance Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
              >
                <MenuItem value="10A">Grade 10 - A</MenuItem>
                <MenuItem value="11A">Grade 11 - A</MenuItem>
                <MenuItem value="12B">Grade 12 - B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                label="Select Subject"
              >
                <MenuItem value="math">Mathematics</MenuItem>
                <MenuItem value="physics">Physics</MenuItem>
                <MenuItem value="english">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" fullWidth>
                Generate
              </Button>
              <IconButton color="primary">
                <DownloadIcon />
              </IconButton>
              <IconButton color="primary">
                <PrintIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {reportType === "attendance"
                  ? "Attendance Report"
                  : "Grades Report"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" startIcon={<PdfIcon />}>
                  Export PDF
                </Button>
                <Button size="small" startIcon={<ExcelIcon />}>
                  Export Excel
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>Student Name</TableCell>
                    {reportType === "attendance" ? (
                      <>
                        <TableCell align="center">Present</TableCell>
                        <TableCell align="center">Absent</TableCell>
                        <TableCell align="center">Percentage</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="center">Assignments</TableCell>
                        <TableCell align="center">Midterm</TableCell>
                        <TableCell align="center">Final</TableCell>
                        <TableCell align="center">Average</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(reportType === "attendance"
                    ? attendanceReport
                    : gradeReport
                  ).map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.student}</TableCell>
                      {reportType === "attendance" ? (
                        <>
                          <TableCell align="center">
                            {(student as any).present}
                          </TableCell>
                          <TableCell align="center">
                            {(student as any).absent}
                          </TableCell>
                          <TableCell align="center">
                            {(student as any).percentage}%
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                (student as any).percentage >= 85
                                  ? "Good"
                                  : "Needs Improvement"
                              }
                              color={
                                (student as any).percentage >= 85
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="center">
                            {(student as any).assignments}%
                          </TableCell>
                          <TableCell align="center">
                            {(student as any).midterm}%
                          </TableCell>
                          <TableCell align="center">
                            {(student as any).final}%
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight={600} color="primary">
                              {(student as any).average}%
                            </Typography>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Summary Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  30
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Attendance
                </Typography>
                <Typography variant="h4" fontWeight={600} color="success.main">
                  89%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Class Average
                </Typography>
                <Typography variant="h4" fontWeight={600} color="primary">
                  88.5%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Performance Distribution
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">A Grade (90%+)</Typography>
                <LinearProgress
                  variant="determinate"
                  value={40}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
                <Typography variant="caption">12 Students</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">B Grade (80-89%)</Typography>
                <LinearProgress
                  variant="determinate"
                  value={35}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
                <Typography variant="caption">10 Students</Typography>
              </Box>
              <Box>
                <Typography variant="body2">C Grade (70-79%)</Typography>
                <LinearProgress
                  variant="determinate"
                  value={25}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
                <Typography variant="caption">8 Students</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
