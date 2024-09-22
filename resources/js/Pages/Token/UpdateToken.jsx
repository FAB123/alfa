import React, { useState } from "react";
import Counter from "./Counter";
import { router, usePage } from "@inertiajs/react";
import { getData, postData } from "../../apis/apiCalls";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Stack, AppBar, Grid, Button } from "@mui/material";
import TopBar from "../General/TopBar";

function UpdateToken() {
    const { user } = usePage().props;
    const [counters, setCounters] = useState(user.counters);
    const [currentCouter, setCurrentCounter] = useState(0);

    const increment = (counter) => {
        postData("token/update_token", {
            counter: counter,
        }).then((response) => {
            if (response.status) {
                setCounters(response.data);
            } else {
                alert(response.message);
            }
        });
    };

    const decrement = (counter) => {
        postData("token/decrement_token_display", {
            counter: counter,
        }).then((response) => {
            if (response.status) {
                setCounters(response.data);
            } else {
                alert(response.message);
            }
        });
    };

    const updateData = () => {
        getData("token/update_data").then((response) => {
            if (response.status) {
                setCounters(response.data);
            } else {
                alert(response.message);
            }
        });
    };

    const resetCounter = (counter) => {
        if (confirm("Are you sure you want to reset the token?")) {
            postData("token/reset_token", {
                counter: counter,
            }).then((response) => {
                if (response.status) {
                    setCounters(response.data);
                } else {
                    alert(response.message);
                }
            });
        }
    };

    const changeCounter = (action) => {
        setCurrentCounter((prev) => (action === "next" ? prev + 1 : prev - 1));
    };

    const getLastData = () => {
        router.reload({ only: ['user'] })

    };

    return (
        <Stack>
            <TopBar />
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100vh" }}
            >
                <Grid item xs={12} md={3}>
                    <Counter
                        name={counters[currentCouter].title}
                        increment={increment}
                        decrement={decrement}
                        updateData={updateData}
                        resetCounter={resetCounter}
                        getLastData={getLastData}
                        count={counters[currentCouter].count}
                        lastIssued={counters[currentCouter].issued_count}
                        maxCount={counters[currentCouter].max_count}
                        kioskMode={counters[currentCouter].kiosk_mode}
                        counter_id={counters[currentCouter].encrypted_counter}
                    />
                </Grid>
            </Grid>
            {counters.length > 1 && (
                <AppBar
                    position="fixed"
                    sx={{ top: "auto", bottom: 0, backgroundColor: "#fff" }}
                >
                    <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        sx={{ p: 0.7 }}
                    >
                        <Button
                            variant="outlined"
                            color="warning"
                            disabled={currentCouter === 0}
                            onClick={() => changeCounter("prev")}
                            startIcon={<KeyboardDoubleArrowLeftIcon />}
                        >
                            NEXT
                        </Button>

                        <Button
                            variant="outlined"
                            disabled={currentCouter >= counters.length - 1}
                            color="warning"
                            onClick={() => changeCounter("next")}
                            endIcon={<KeyboardDoubleArrowRightIcon />}
                        >
                            NEXT
                        </Button>
                    </Stack>
                </AppBar>
            )}
        </Stack>
    );
}

export default UpdateToken;
