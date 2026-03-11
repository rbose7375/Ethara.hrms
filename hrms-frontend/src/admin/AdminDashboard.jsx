import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    Avatar,
    LinearProgress
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaidIcon from "@mui/icons-material/Paid";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminDashboard() {

    const stats = [
        {
            title: "Total Employees",
            value: "124",
            icon: <PeopleIcon />,
            color: "#4F46E5"
        },
        {
            title: "Working Hours",
            value: "312",
            icon: <AccessTimeIcon />,
            color: "#0EA5E9"
        },
        {
            title: "Payroll This Month",
            value: "$45K",
            icon: <PaidIcon />,
            color: "#10B981"
        },
        {
            title: "Attendance Today",
            value: "98%",
            icon: <EventAvailableIcon />,
            color: "#F59E0B"
        }
    ];

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>

        <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <Topbar />
                <Box sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{display: "flex",justifyContent: "space-between",alignItems: "center",mb: 4}}>
                        <Typography variant="h4" sx={{fontWeight: 700,background: "linear-gradient(90deg,#146886,#0ea5e9)",WebkitBackgroundClip: "text",WebkitTextFillColor: "transparent"}}>
                            HRMS Admin Dashboard
                        </Typography>
                        <Button variant="contained" sx={{background: "linear-gradient(135deg,#146886,#0ea5e9)",borderRadius: 3,px: 3,py: 1.2,textTransform: "none",fontWeight: 600,boxShadow: "0 8px 20px rgba(0,0,0,0.15)",":hover": {    transform: "translateY(-2px)"}}}>
                            Add Employee
                        </Button>
                    </Box>
                    {/* Stats Cards */}
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                                <Card sx={{p: 3,borderRadius: 4,background: "white",boxShadow: "0 10px 30px rgba(0,0,0,0.06)",transition: "0.3s",":hover": {    transform: "translateY(-6px)",    boxShadow: "0 16px 40px rgba(0,0,0,0.12)"}}}>
                                    <Box sx={{display: "flex",justifyContent: "space-between",alignItems: "center"}}>
                                        <Box>
                                            <Typography variant="body2" sx={{color: "#6b7280",fontWeight: 500 }}>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h4" sx={{fontWeight: 700,mt: 1 }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{background: stat.color, width: 50, height: 50 }}>
                                            {stat.icon}
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <LinearProgress variant="determinate" value={70} sx={{     height: 6,     borderRadius: 5,     background: "#e5e7eb",     "& .MuiLinearProgress-bar": {         background: stat.color     } }}/>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}