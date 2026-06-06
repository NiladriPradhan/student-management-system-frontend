import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";

const gradesData = [
  {
    id: 1,
    student: "John Doe",
    assignments: 85,
    midterm: 88,
    final: 92,
    overall: 88.3,
    grade: "B+",
  },
  {
    id: 2,
    student: "Jane Smith",
    assignments: 92,
    midterm: 90,
    final: 94,
    overall: 92.0,
    grade: "A-",
  },
  {
    id: 3,
    student: "Mike Johnson",
    assignments: 78,
    midterm: 82,
    final: 85,
    overall: 81.7,
    grade: "B",
  },
  {
    id: 4,
    student: "Sarah Williams",
    assignments: 95,
    midterm: 92,
    final: 96,
    overall: 94.3,
    grade: "A",
  },
];

export default function TeacherGrades() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Grade Management
        </Typography>
        <Button variant="contained">Export Grades</Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>Student Name</TableCell>
                <TableCell align="center">Assignments</TableCell>
                <TableCell align="center">Midterm</TableCell>
                <TableCell align="center">Final</TableCell>
                <TableCell align="center">Overall</TableCell>
                <TableCell align="center">Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradesData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Typography fontWeight={500}>{student.student}</Typography>
                  </TableCell>
                  <TableCell align="center">{student.assignments}%</TableCell>
                  <TableCell align="center">{student.midterm}%</TableCell>
                  <TableCell align="center">{student.final}%</TableCell>
                  <TableCell align="center">{student.overall}%</TableCell>
                  <TableCell align="center">
                    <Chip label={student.grade} color="primary" size="small" />
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
