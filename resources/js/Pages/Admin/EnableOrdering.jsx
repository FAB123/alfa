import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
} from "@mui/material";
import React, { useState } from "react";
import { postData } from "../../apis/apiCalls";

function EnableOrdering({ account }) {
    const [enable, setEnable] = useState(account.enable_ordering);
    const [counter, setCounter] = useState(account.encrypted_ordering_counter);

    const handleSubmit = () => {
        try {
            postData("/admin/save-enable-ordering", {
                counter,
                enable,
                encrypted_user: account.encrypted_user,
            }).then((response) => {
                if (!response.error) {
                    // window.location.reload();
                } else {
                    alert("An error occurred while updating enable ordering.");
                }
            });
        } catch (error) {
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <Paper>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <Stack spacing={1}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={enable}
                                            onChange={() => setEnable(!enable)}
                                        />
                                    }
                                    labelPlacement="start"
                                    label="Enable Ordering"
                                />
                                {enable && (
                                    <FormControl fullWidth>
                                        <InputLabel id="select-counter">
                                            Select Counter
                                        </InputLabel>
                                        <Select
                                            labelId="select-counter"
                                            value={counter}
                                            label="Select Counter"
                                            onChange={(e) =>
                                                setCounter(e.target.value)
                                            }
                                        >
                                            {account.counters.map((item, i) => (
                                                <MenuItem
                                                    value={
                                                        item.encrypted_counter
                                                    }
                                                    key={i}
                                                >
                                                    {item.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </FormGroup>
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
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

export default EnableOrdering;
