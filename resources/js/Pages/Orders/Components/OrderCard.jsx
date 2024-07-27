import {
    Button,
    Card,
    CardActions,
    CardContent,
    TableContainer,
    Table,
    TableCell,
    TableRow,
    Paper,
    Typography,
    Stack,
    TableBody,
} from "@mui/material";
import React from "react";
import { postData } from "../../../apis/apiCalls";

function OrderCard({ data, apiCall }) {
    const updateOrder = (order_id, status) => {
        postData("orders/update-order-item", { order_id, status }).then(
            (response) => {
                if (response.status) {
                    alert("updated");
                    apiCall();
                }
            }
        );
    };

    return (
        <Card sx={{ border: "3px solid #d397fa" }}>
            <CardContent>
                <Stack direction={"row"} spacing={5}>
                    <Stack sx={{ width: "30%" }}>
                        <Card
                            sx={{
                                boxShadow: 5,
                                borderRadius: 2,
                            }}
                        >
                            <CardContent>
                                <Stack direction={"column"}>
                                    <Typography gutterBottom variant="body1" å>
                                        OrderID: {data.order_id}
                                    </Typography>
                                    <Typography
                                        gutterBottom
                                        variant="caption"
                                        color="text.primary"
                                    >
                                        Time:
                                        {new Date(
                                            data.created_at
                                        ).toLocaleString("en-GB")}
                                    </Typography>
                                    <Typography
                                        gutterBottom
                                        variant="caption"
                                        color="text.primary"
                                        sx={{ mt: 1 }}
                                    >
                                        Token: {data.token_number}
                                    </Typography>
                                    <Typography
                                        gutterBottom
                                        variant="caption"
                                        color="text.primary"
                                        sx={{ mt: 1 }}
                                    >
                                        Status: {data.status}
                                    </Typography>
                                    <Typography
                                        gutterBottom
                                        variant="caption"
                                        color="text.primary"
                                        sx={{ mt: 1 }}
                                    >
                                        Amount : {data.total}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack sx={{ width: "80%" }}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell align="right">
                                            Price
                                        </TableCell>
                                        <TableCell align="right">Qty</TableCell>
                                        <TableCell align="right">
                                            Addons
                                        </TableCell>
                                    </TableRow>

                                    {data.ordered_items.map((item, k) => (
                                        <TableRow key={k}>
                                            <TableCell>
                                                {item?.item.item_name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.item_unit_price}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.order_quantity}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.tags.join(", ")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Stack>
            </CardContent>
            {data.status === "B" && (
                <CardActions
                    sx={{
                        display: "flex",
                    }}
                >
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => updateOrder(data.order_id, "CO")}
                    >
                        Cancel Order
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => updateOrder(data.order_id, "I")}
                    >
                        Invoice
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => updateOrder(data.order_id, "C")}
                    >
                        Complete
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

export default OrderCard;
