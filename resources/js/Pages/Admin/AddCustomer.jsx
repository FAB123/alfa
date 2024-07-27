import { router, usePage } from "@inertiajs/react";
import {
    Alert,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

function AddCustomer() {
    const { flash } = usePage().props;
    const [values, setValues] = useState({
        account_name: "",
        shop_name: "",
        shop_name_ar: "",
        email: "",
        password: "",
    });

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value;
        setValues((values) => ({
            ...values,
            [key]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post("/admin/save-account", values);
    }

    return (
        <Grid container justifyContent={"center"} alignItems={"center"}>
            <Grid item xs={12} md={4}>
                <Paper elevation={20} sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Typography>ADD/EDIT CUSTOMER</Typography>

                            <TextField
                                label="ACCOUNT NAME"
                                id="account_name"
                                value={values.account_name}
                                onChange={handleChange}
                            />
                            <TextField
                                label="SHOP Name"
                                id="shop_name"
                                value={values.shop_name}
                                onChange={handleChange}
                            />
                            <TextField
                                label="SHOP Name Arabic"
                                id="shop_name_ar"
                                value={values.shop_name_ar}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Email"
                                id="email"
                                value={values.email}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Password"
                                id="password"
                                value={values.password}
                                onChange={handleChange}
                            />
                            {flash.message && (
                                <Alert severity="error">{flash.message}</Alert>
                            )}
                            <Stack spacing={2} direction={"row"}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    type="reset"
                                >
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit">
                                    SUBMIT
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default AddCustomer;
