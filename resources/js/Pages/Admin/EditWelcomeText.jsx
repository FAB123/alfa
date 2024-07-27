import {
    Button,
    Card,
    CardActions,
    CardContent,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { postData } from "../../apis/apiCalls";

const defaultValue = {
    welcome_text: "",
    welcome_text_ar: "",
};

function EditWelcomeText({ account }) {
    const [values, setValues] = useState(defaultValue);

    useEffect(() => {
        if (account) {
            setValues({
                welcome_text: account.welcome_text || "",
                welcome_text_ar: account.welcome_text_ar || "",
                encrypted_user: account.encrypted_user || null,
            });
        }
    }, [account]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postData("/admin/save-welcome-text", values);
            if (!response.error) {
                window.location.reload();
            } else {
                alert("An error occurred while saving the welcome text.");
            }
        } catch (error) {
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel?")) {
            setValues({
                ...defaultValue,
                encrypted_user: account.encrypted_user,
            });
        }
    };

    return (
        <Paper>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography>ADD/EDIT Welcome Text</Typography>
                            <TextField
                                label="Welcome Text"
                                id="welcome_text"
                                size="small"
                                value={values.welcome_text}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Welcome Text Arabic"
                                id="welcome_text_ar"
                                size="small"
                                value={values.welcome_text_ar}
                                onChange={handleChange}
                            />
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            size="small"
                        >
                            Submit
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </Paper>
    );
}

export default EditWelcomeText;
