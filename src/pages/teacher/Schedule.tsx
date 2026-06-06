import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getTeacherSchedule } from "../../services/schedule.service";
import type { ClassSchedule } from "../../types/schedule";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Schedule as ScheduleIcon,
  Room as RoomIcon,
  Today as TodayIcon,
} from "@mui/icons-material";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const numericDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const normalizeDayOfWeek = (dayOfWeek: ClassSchedule["day_of_week"]) => {
  if (typeof dayOfWeek === "number") {
    return numericDayNames[dayOfWeek] ?? "";
  }

  const dayName = String(dayOfWeek).trim();
  const numericDay = Number(dayName);

  if (!Number.isNaN(numericDay)) {
    return numericDayNames[numericDay] ?? "";
  }

  return days.find((day) => day.toLowerCase() === dayName.toLowerCase()) ?? "";
};

const formatTime = (time: string) => time?.slice(0, 5) || "--:--";

export default function TeacherSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekly, setWeekly] = useState<Record<string, ClassSchedule[]>>({});

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await getTeacherSchedule();

        const grouped: Record<string, ClassSchedule[]> = {};
        days.forEach((day) => (grouped[day] = []));

        rows.forEach((schedule) => {
          const dayName = normalizeDayOfWeek(schedule.day_of_week);

          if (dayName) {
            grouped[dayName].push(schedule);
          }
        });

        days.forEach((day) => {
          grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
        });

        setWeekly(grouped);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

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
          Class Schedule
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            onClick={() =>
              setCurrentWeek((week) => {
                const nextWeek = new Date(week);
                nextWeek.setDate(nextWeek.getDate() - 7);
                return nextWeek;
              })
            }
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">
            {currentWeek.toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <IconButton
            onClick={() =>
              setCurrentWeek((week) => {
                const nextWeek = new Date(week);
                nextWeek.setDate(nextWeek.getDate() + 7);
                return nextWeek;
              })
            }
          >
            <ChevronRightIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            sx={{ ml: 2 }}
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : error ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        ) : (
          days.map((day) => {
            const classes = weekly[day] || [];
            const isToday = getCurrentDay() === day;

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={day}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                    height: '100%',
                    border: isToday ? '2px solid #2196f3' : 'none',
                    bgcolor: isToday ? '#f0f7ff' : 'white',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {day}
                    </Typography>
                    {isToday && (
                      <Chip label="Today" color="primary" size="small" />
                    )}
                  </Box>

                  {classes.length > 0 ? (
                    classes.map((cls) => (
                      <Card key={cls.id} sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {cls.subject}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Class: {cls.class_name || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Section: {cls.section || "N/A"}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              mt: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption">
                                Start: {formatTime(cls.start_time)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption">
                                End: {formatTime(cls.end_time)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RoomIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption">
                                Room {cls.room_number || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      sx={{ py: 4 }}
                    >
                      No classes scheduled
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
