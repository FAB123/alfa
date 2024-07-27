import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, TextField, Stack } from "@mui/material";

export const FormInputText = ({
    name,
    control,
    label,
    type,
    helperText,
    multiline,
    onKeyDown,
}) => {
    return (
        <FormControl fullWidth sx={{ p: 0.8 }}>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                }) => (
                    <Stack direction={"row"}>
                        <TextField
                            helperText={error ? error.message : helperText}
                            error={!!error}
                            onChange={onChange}
                            size="small"
                            fullWidth={true}
                            onKeyDown={onKeyDown}
                            
                            multiline={multiline}
                            rows={multiline ? 3 : 1}
                            id={name}
                            onBlur={onBlur}
                            value={value}
                            type={type ? type : "text"}
                            label={label}
                            autoComplete="on"
                            variant="outlined"
                        />
                    </Stack>
                )}
            />
        </FormControl>
    );
};
