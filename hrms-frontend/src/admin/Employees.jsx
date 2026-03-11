import { DataGrid } from "@mui/x-data-grid";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export default function Employees() {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("/employees")
            .then(res => {
                setEmployees(res.data)
            })
    }, [])

    const columns = [
        { field: "employee_id", headerName: "ID", width: 80 },
        { field: "full_name", headerName: "Name", width: 200 },
        { field: "email_address", headerName: "Email", width: 220 },
        { field: "department", headerName: "Department", width: 150 },
        { field: "is_active", headerName: "Active", width: 120 },
    ];

    return (

        <div style={{ height: 600 }}>
            <DataGrid
                rows={employees}
                columns={columns}
                pageSize={10}
            />
        </div>

    )
}