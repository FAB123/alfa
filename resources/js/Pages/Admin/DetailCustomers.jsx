import { router, usePage } from "@inertiajs/react";
import {
    Grid,
    Stack,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import EditIcon from "@mui/icons-material/Edit";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { getData, postData } from "../../apis/apiCalls";
import EditWelcomeText from "./EditWelcomeText";
import UpdateShopImage from "./UpdateShopImage";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EnableOrdering from "./EnableOrdering";

const items = [
    "email",
    "name",
    "shop_name",
    "shop_name_ar",
    "shop_id",
    "ordering_counter",
];

const defaultValue = {
    encrypted_counter: null,
    title: "",
    max_count: "",
    kiosk_mode: false,
};

const DetailCustomers = () => {
    const { account } = usePage().props;
    const [values, setValues] = useState({
        ...defaultValue,
        encrypted_user: account.encrypted_user,
    });

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value;
        setValues((values) => ({
            ...values,
            [key]: value,
        }));
    }

    function handleSwitch(e) {
        const value = e.target.checked;
        setValues((values) => ({
            ...values,
            kiosk_mode: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        postData("/admin/save-counter", values).then((response) => {
            if (!response.error) {
                router.reload();
            } else {
                alert("error");
            }
        });
    }

    const editCouter = (data) => {
        setValues({
            ...values,
            encrypted_counter: data.encrypted_counter,
            max_count: data.max_count,
            kiosk_mode: data.kiosk_mode,
            title: data.title,
        });
    };

    const deleteCouter = (data) => {
        if (confirm("are you sure?")) {
            getData(`/admin/delete-counter/${data.encrypted_counter}`).then(
                (response) => {
                    if (!response.error) {
                        router.reload();
                    } else {
                        alert("error");
                    }
                }
            );
        }
    };

    return (
        <Grid
            container
            spacing={1}
            justifyContent="center"
            direction="row"
            alignItems="stretch"
        >
            <Grid item xs={12} md={3}>
                <Stack direction={"column"} spacing={1}>
                    <Paper>
                        <List dense={true}>
                            {items.map((item, index) => (
                                <Stack key={index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={item}
                                            // secondary={item}
                                        />
                                        <Typography>{account[item]}</Typography>
                                    </ListItem>
                                    <Divider component="li" />
                                </Stack>
                            ))}
                        </List>
                    </Paper>
                    <EditWelcomeText account={account} />
                    <EnableOrdering account={account} />
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell align="center">
                                        Max Count
                                    </TableCell>
                                    <TableCell align="center">
                                        Last Reset
                                    </TableCell>
                                    <TableCell align="center">Kiosk</TableCell>
                                    <TableCell align="center">Count</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {account?.counters.map((row, key) => (
                                    <TableRow
                                        key={key}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.max_count}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.last_reset}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.kiosk_mode ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.count}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack
                                                direction={"row"}
                                                justifyContent={"flex-end"}
                                            >
                                                <IconButton
                                                    color="success"
                                                    onClick={() => {
                                                        editCouter(row);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        deleteCouter(row);
                                                    }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Stack direction={"column"} spacing={1}>
                    <Paper>
                        <Card>
                            <form onSubmit={handleSubmit}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Typography>
                                            ADD/EDIT COUNTER
                                        </Typography>
                                        <TextField
                                            label="TITLE"
                                            id="title"
                                            size="small"
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            label="MAX COUNT"
                                            id="max_count"
                                            size="small"
                                            value={values.max_count}
                                            onChange={handleChange}
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.kiosk_mode}
                                                    onChange={handleSwitch}
                                                />
                                            }
                                            label="KIOSK Mode"
                                        />
                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color={"error"}
                                        size="small"
                                        onClick={() =>
                                            confirm("Are You Sure")
                                                ? setValues({
                                                      ...defaultValue,
                                                      encrypted_user:
                                                          account.encrypted_user,
                                                  })
                                                : null
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"success"}
                                        type="submit"
                                        size="small"
                                    >
                                        Submit
                                    </Button>
                                </CardActions>
                            </form>
                        </Card>
                    </Paper>
                    <UpdateShopImage account={account} />
                </Stack>
            </Grid>
        </Grid>
    );
};

export default DetailCustomers;
