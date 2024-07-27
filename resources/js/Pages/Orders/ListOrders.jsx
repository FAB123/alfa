import React, { useEffect, useState } from "react";
import TopBar from "../General/TopBar";
import { Button, Paper, Stack } from "@mui/material";
import { getData } from "../../apis/apiCalls";
import OrderCard from "./Components/OrderCard";

function ListOrders() {
    const [datas, setDatas] = useState([]);
    const [mode, setMode] = useState("pending");

    const apiCall = () => {
        getData(`orders/get-order-list/${mode}/asc`).then((response) => {
            if (response.status) {
                setDatas(response.result);
            }
        });
    };
    useEffect(() => {
        setInterval(() => apiCall(), 10000);
    }, []);

    useEffect(() => {
        apiCall();
    }, [mode]);

    return (
        <>
            <TopBar />
            <Paper sx={{ mt: 6, padding: 1 }}>
                <Paper elevation={3} sx={{ marginY: 1, padding: 1 }}>
                    <Stack spacing={1} direction={"row"}>
                        <Button
                            variant={mode === "pending" ? "contained" : "text"}
                            color="warning"
                            onClick={() => setMode("pending")}
                        >
                            Pending Orders
                        </Button>
                        <Button
                            variant={mode === "canceled" ? "contained" : "text"}
                            onClick={() => setMode("canceled")}
                            color="warning"
                        >
                            Canceled Orders
                        </Button>
                        <Button
                            onClick={() => setMode("completed")}
                            variant={
                                mode === "completed" ? "contained" : "text"
                            }
                            color="warning"
                        >
                            Completed Orders
                        </Button>
                    </Stack>
                </Paper>
                <Stack spacing={2}>
                    {datas.map((data, i) => (
                        <OrderCard key={i} data={data} apiCall={apiCall} />
                    ))}
                </Stack>
            </Paper>
        </>
    );
}

export default ListOrders;
