import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

function GeneralLoginScreen({ url }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(url, { email, password });
    };

    return (
        <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ height: "100vh" }}
        >
            <Grid item xs={12} md={3}>
                <Paper elevation={20} sx={{ width: "100%" }}>
                    <form method="post" onSubmit={handleSubmit}>
                        <Stack alignItems={"center"} p={2} spacing={4}>
                            <Typography variant="h4">Login</Typography>
                            <Stack spacing={1} width={"100%"}>
                                <TextField
                                    size="small"
                                    fullWidth={true}
                                    label="EMAIL"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <TextField
                                    size="small"
                                    fullWidth={true}
                                    label="PASSWORD"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                    type="password"
                                />
                            </Stack>
                            {flash.message && (
                                <Typography color={"error"}>
                                    {flash.message}
                                </Typography>
                            )}
                            <Button variant="outlined" type="submit">
                                Login
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default GeneralLoginScreen;
