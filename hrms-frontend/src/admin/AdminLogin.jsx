import { TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { getRole } from "../utils/auth";

export default function AdminLogin() {

    useEffect(() => {

        const role = getRole();

        if (role === "admin") {
            window.location.href = "/admin/dashboard";
        }

        if (role === "employee") {
            window.location.href = "/employee/dashboard";
        }

    }, []);


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        // validation
        if (!email || !password) {
            alert("Please fill email and password first");
            return;
        }

        try {

            const res = await axios.post(
                "http://localhost:8000/api/v1/admin/login/",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login success:", res.data);

            localStorage.setItem("user", JSON.stringify(res.data.user_data));
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            if (res.data.role === "admin") {
                window.location.href = "/admin/dashboard";
            }

            if (res.data.role === "employee") {
                window.location.href = "/employee/dashboard";
            }

        } catch (error) {

            console.error("Login failed:", error);
            alert("Invalid credentials");

        }

    };

    return (

        <div style={styles.page}>

            <div style={styles.card}>

                {/* LEFT SIDE */}
                <div style={styles.left}>

                    <h1 style={styles.logo}>ETHARA AI</h1>
                    <p style={styles.tagline}>HRMS Management System</p>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2620/2620277.png"
                        alt="hrms"
                        style={styles.vector}
                    />

                </div>

                {/* RIGHT SIDE */}
                <div style={styles.right}>

                    <h2 style={styles.loginTitle}>Admin Login</h2>

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        value={password}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            background: "#146886",
                            padding: "12px",
                            fontWeight: "bold",
                            "&:hover": {
                                background: "#0f556d"
                            }
                        }}
                    >
                        LOGIN
                    </Button>

                </div>

            </div>

        </div>
    );
}

const styles = {

    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#e6f1f5,#d6e7ef)"
    },

    card: {
        width: "850px",
        height: "460px",
        display: "flex",
        background: "white",
        borderRadius: "14px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
        overflow: "hidden"
    },

    left: {
        width: "45%",
        background: "#146886",
        color: "white",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    right: {
        width: "55%",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },

    logo: {
        fontSize: "32px",
        fontWeight: "bold",
        marginBottom: "10px"
    },

    tagline: {
        opacity: "0.8",
        marginBottom: "30px"
    },

    vector: {
        width: "160px",
        opacity: "0.9"
    },

    loginTitle: {
        marginBottom: "30px",
        color: "#146886",
        fontWeight: "bold"
    },
    page: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#e6f1f5,#d6e7ef)"
    }

}