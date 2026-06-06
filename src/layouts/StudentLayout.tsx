import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { logout } from "../utils/auth";
import { getDisplayName, useCurrentUser } from "../hooks/useCurrentUser";

const drawerWidth = 280;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/student/dashboard" },
  { text: "My Courses", icon: <BookIcon />, path: "/student/my-course" },
  { text: "Attendance", icon: <CalendarIcon />, path: "/student/attendance" },
  {
    text: "Assignments",
    icon: <AssignmentIcon />,
    path: "/student/assignments",
  },
  { text: "Grades", icon: <GradeIcon />, path: "/student/grades" },
  { text: "Messages", icon: <MessageIcon />, path: "/student/messages" },
  { text: "Profile", icon: <PersonIcon />, path: "/student/profile" },
  { text: "Settings", icon: <SettingsIcon />, path: "/student/settings" },
];

export default function StudentLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const { user, loading: userLoading } = useCurrentUser();
  const displayName = getDisplayName(user, "Student User", userLoading);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
          🎓 Student Portal
        </Typography>
      </Box>
      <Divider />
      <List sx={{ mt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(102, 126, 234, 0.12)",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.16)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "#667eea", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "#333",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}
            >
              Welcome back, {displayName}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationOpen}>
                <Badge badgeContent={5} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: "#667eea", width: 38, height: 38 }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Notifications
              </Typography>
            </Box>
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  New assignment posted
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mathematics - Due in 3 days
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 1.5, textAlign: "center" }}>
              <Typography variant="body2" color="primary">
                View all notifications
              </Typography>
            </Box>
          </Menu>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Avatar
                sx={{ width: 32, height: 32, mr: 1.5, bgcolor: "#667eea" }}
              />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email ?? ""}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavigation("/student/profile")}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/student/settings")}>
              <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: "#f44336" }} />
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8,
            border: "none",
            boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
            height: "calc(100% - 64px)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
