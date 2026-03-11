import { TextField, Button, Card } from "@mui/material";
import axios from "../api/axios";
import { useState } from "react";

export default function AddEmployee() {

    const [data, setData] = useState({
        email: "",
        password: "",
        full_name: "",
        department: ""
    });

    const handleSubmit = async () => {

        await axios.post("/employees/create", data)

        alert("Employee Created")

    }

    return (

        <Card sx={{ p: 4, maxWidth: 500 }}>

            <TextField label="Full Name" fullWidth sx={{ mb: 2 }}
                onChange={(e) => setData({ ...data, full_name: e.target.value })}
            />

            <TextField label="Email" fullWidth sx={{ mb: 2 }}
                onChange={(e) => setData({ ...data, email: e.target.value })}
            />

            <TextField label="Password" fullWidth sx={{ mb: 2 }}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <TextField label="Department" fullWidth sx={{ mb: 2 }}
                onChange={(e) => setData({ ...data, department: e.target.value })}
            />

            <Button variant="contained" onClick={handleSubmit}>
                Add Employee
            </Button>

        </Card>

    )

}

const deleteEmployee = async (id) => {

    await axios.delete(`/employees/${id}`)

}