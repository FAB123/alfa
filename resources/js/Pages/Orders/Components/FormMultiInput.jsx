import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
    FormControl,
    Select,
    Box,
    OutlinedInput,
    Chip,
    MenuItem,
    InputLabel,
    FormHelperText,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName) {
    return {
        fontWeight: personName.indexOf(name) === -1 ? 400 : 600,
    };
}

export const FormMultiInput = ({ name, control, label, options }) => {
    // const [personName, setPersonName] = useState([]);

    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setPersonName(typeof value === "string" ? value.split(",") : value);
    // };
    return (
        // <FormControl fullWidth sx={{ p: 0.8 }}>
        //     <Controller
        //         name={name}
        //         control={control}
        //         render={({
        //             field: { onChange, value, onBlur },
        //             fieldState: { error },
        //         }) => (
        //             <Stack direction={"row"}>
        //                 <TextField
        //                     helperText={error ? error.message : helperText}
        //                     error={!!error}
        //                     onChange={onChange}
        //                     size="small"
        //                     fullWidth={true}
        //                     onKeyDown={onKeyDown}

        //                     multiline={multiline}
        //                     rows={multiline ? 3 : 1}
        //                     id={name}
        //                     onBlur={onBlur}
        //                     value={value}
        //                     type={type ? type : "text"}
        //                     label={label}
        //                     autoComplete="on"
        //                     variant="outlined"
        //                 />
        //             </Stack>
        //         )}
        //     />
        // </FormControl>

        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
            }) => (
                <FormControl
                    fullWidth
                    sx={{ p: 0.8 }}
                    error={error ? true : false}
                >
                    <InputLabel id="multiple-chip">{label}</InputLabel>
                    <Select
                        labelId="multiple-chip"
                        id="select-multiple-chip"
                        multiple
                        value={value}
                        size="small"
                        onChange={(event) => {
                            let value = event.target.value;
                            onChange(
                                typeof value === "string"
                                    ? value.split(",")
                                    : value
                            );
                        }}
                        input={
                            <OutlinedInput
                                id="select-multiple-chip"
                                label="Chip"
                            />
                        }
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >
                                {selected.map((value) => (
                                    <Chip
                                        color="success"
                                        variant="outlined"
                                        key={value}
                                        label={value}
                                    />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                value={option}
                                style={getStyles(option, value)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Select>

                    <FormHelperText>{error}</FormHelperText>
                </FormControl>
            )}
        />
    );
};
