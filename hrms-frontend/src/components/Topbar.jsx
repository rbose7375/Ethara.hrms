import { Box, Typography } from "@mui/material";

export default function Topbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Box
            sx={{
                height: 70,
                background: "white",
                borderBottom: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 30px"
            }}
        >
            <Typography variant="h6">Dashboard</Typography>

            <Typography>{user?.full_name}</Typography>
        </Box>
    );
}