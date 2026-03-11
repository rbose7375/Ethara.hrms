import { Box, Typography } from "@mui/material";

export default function Sidebar() {
    return (
        <Box sx={{ width: 240, flexShrink: 0 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
                ETHARA AI
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography>Dashboard</Typography>
                <Typography>Employees</Typography>
                <Typography>Attendance</Typography>
                <Typography>Departments</Typography>
            </Box>
        </Box>
    );
}