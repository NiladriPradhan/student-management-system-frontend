// StudentProfile.tsx
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

export default function StudentProfile() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{ p: 3, borderRadius: 3, boxShadow: 2, textAlign: "center" }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                bgcolor: "#667eea",
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              John Doe
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Student ID: STU-2024-001
            </Typography>
            <Chip
              label="Active Student"
              color="success"
              size="small"
              sx={{ mt: 1 }}
            />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: "left" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2">john.doe@student.com</Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2">+1 234 567 890</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SchoolIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2">Grade 12 - Section A</Typography>
              </Box>
            </Box>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  defaultValue="John Doe"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue="john.doe@student.com"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  defaultValue="+1 234 567 890"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  defaultValue="2005-05-15"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  defaultValue="123 School Street, City"
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Academic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Grade" defaultValue="Grade 12" />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Section" defaultValue="A" />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Roll Number" defaultValue="001" />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button variant="contained">Save Changes</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
