import React, { useEffect, useState } from "react";
import "@fontsource/orbitron/800.css";
import {
    Card,
    CardHeader,
    Fab,
    IconButton,
    Stack,
    Divider,
    CardContent,
    CardActions,
    Typography,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CampaignIcon from "@mui/icons-material/Campaign";
import { styled } from "@mui/system";
import { postData } from "../../apis/apiCalls";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ManualToken from "./ManualToken";

const CustomButton = styled(Fab)({
    width: 100,
    height: 100,
    backgroundColor: "red",
    color: "#fff",
    ":hover": {
        backgroundColor: "#f0a",
    },
});

function Counter({
    name,
    count,
    decrement,
    increment,
    counter_id,
    resetCounter,
    kioskMode,
    getLastData,
    lastIssued,
    updateData,
    maxCount,
}) {
    useEffect(() => {
        if (maxCount === count) {
            alert("Maximum token reached, it will reset on next update.");
        }
    }, [count]);

    const [doUpdateToken, setDoUpdateToken] = useState(false);

    const recallCounter = () => {
        postData("token/recall_token_display", { counter_id: counter_id }).then(
            (response) => console.log(response)
        );
    };

    const handleClose = () => {
        getLastData();
        setDoUpdateToken(false);
    };

    return (
        // <Paper
        //     elevation={20}
        //     sx={{ width: "100%", borderRadius: 4, height: "60vh" }}
        // >
        //     <Stack justifyContent={"flex-end"} alignItems={"flex-end"}>
        //         <IconButton onClick={() => resetCounter(counter_id)}>
        //             <RotateLeftIcon color="error" />
        //         </IconButton>
        //     </Stack>
        //     <Stack
        //         justifyContent={"space-between"}
        //         alignItems={"center"}
        //         sx={{ p: 2 }}
        //         spacing={4}
        //     >
        //         <Typography
        //             fontWeight={800}
        //             fontSize={30}
        //             sx={{ fontFamily: "Orbitron" }}
        //         >
        //             {name}
        //         </Typography>
        //         <Typography
        //             fontWeight={800}
        //             fontSize={50}
        //             sx={{ fontFamily: "Orbitron", color: "#0f0" }}
        //         >
        //             {count}
        //         </Typography>

        //         <CustomButton onClick={() => increment(counter_id)}>
        //             <Typography fontWeight={800} fontSize={50}>
        //                 +
        //             </Typography>
        //         </CustomButton>

        //         {kioskMode ? (
        //             <Stack
        //                 direction={"row"}
        //                 justifyContent={"space-between"}
        //                 width={"100%"}
        //                 alignItems={"center"}
        //             >
        //                 <Typography
        //                     variant="body2"
        //                     sx={{ fontFamily: "Orbitron" }}
        //                 >
        //                     Last Issued Token:
        //                 </Typography>

        //                 <Typography
        //                     variant="body2"
        //                     fontSize={30}
        //                     sx={{ fontFamily: "Orbitron", color: "#f00" }}
        //                 >
        //                     {lastIssued}
        //                 </Typography>
        //                 <IconButton size="small" onClick={updateData}>
        //                     <SyncAltRoundedIcon
        //                         fontSize="small"
        //                         color="success"
        //                     />
        //                 </IconButton>
        //             </Stack>
        //         ) : (
        //             ""
        //         )}
        //     </Stack>
        // </Paper>

        <Card>
            <CardHeader
                title={name}
                titleTypographyProps={{
                    fontWeight: 600,
                    color: "red",
                }}
                action={
                    // <IconButton onClick={() => resetCounter(counter_id)}>
                    //     <RotateLeftIcon color="error" />
                    // </IconButton>

                    <>
                        <IconButton onClick={recallCounter}>
                            <CampaignIcon color="warning" />
                        </IconButton>
                        <IconButton
                            onClick={() => setDoUpdateToken(counter_id)}
                        >
                            <EditCalendarIcon color="success" />
                        </IconButton>
                        <IconButton onClick={() => resetCounter(counter_id)}>
                            <RotateLeftIcon color="error" />
                        </IconButton>
                    </>
                }
            />
            <Divider />

            <ManualToken
                open={doUpdateToken}
                handleClose={handleClose}
                url={"token/update_token_by_count"}
            />

            <CardContent>
                <Stack direction={"column"} alignItems={"center"} spacing={1}>
                    <CustomButton
                        color="warning"
                        onClick={() => increment(counter_id)}
                    >
                        <ArrowBackIosIcon
                            style={{
                                transform: "rotate(90deg)",
                                fontWeight: 800,
                                fontSize: 40,
                            }}
                        />
                    </CustomButton>

                    <Typography
                        fontWeight={800}
                        fontSize={50}
                        sx={{ fontFamily: "Orbitron", color: "#0f0" }}
                    >
                        {count ?? 0}
                    </Typography>
                    <CustomButton
                        color="warning"
                        onClick={() => decrement(counter_id)}
                        disabled={count === 0}
                    >
                        <ArrowBackIosIcon
                            style={{
                                transform: "rotate(270deg)",
                                fontWeight: 800,
                                fontSize: 40,
                            }}
                        />
                    </CustomButton>
                </Stack>
            </CardContent>
            {kioskMode ? (
                <>
                    <Divider />
                    <CardActions>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            width={"100%"}
                            alignItems={"center"}
                        >
                            <Typography
                                variant="body2"
                                sx={{ fontFamily: "Orbitron" }}
                            >
                                Last Issued Token:
                            </Typography>

                            <Typography
                                variant="body2"
                                fontSize={30}
                                sx={{ fontFamily: "Orbitron", color: "#f00" }}
                            >
                                {lastIssued}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={updateData}
                                aria-label="sync"
                            >
                                <SyncAltRoundedIcon
                                    fontSize="small"
                                    color="success"
                                />
                            </IconButton>
                        </Stack>
                    </CardActions>
                </>
            ) : (
                ""
            )}
        </Card>
    );
}

export default Counter;
