import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
} from "@mui/material";
import { FormInputText } from "./FormInputText";
import { postData } from "../../../apis/apiCalls";
import { router } from "@inertiajs/react";

const validator = yup.object({
    tag: yup.string().required(),
});

function AddTag({ editItem, setEditItem }) {
    const { control, reset, handleSubmit } = useForm({
        resolver: yupResolver(validator),
        defaultValues: {
            tag: "",
            tag_id: null,
        },
        mode: "onBlur",
    });

    useEffect(() => {
        if (editItem) {
            reset({
                tag: editItem.tag,
                tag_id: editItem.id,
            });
        } else {
            reset({
                tag: "",
                tag_id: null,
            });
        }
    }, [editItem]);

    const onSubmit = (value) => {
        postData("/orders/save-tag", value).then((response) => {
            if (response.status) {
                alert("Item Saved");
                setEditItem(null);
                reset();
                router.reload();
            } else {
                alert(response.message);
            }
        });
    };
    return (
        <Card>
            <CardHeader subheader="ADD/EDIT TAG" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <FormInputText label="TAG" control={control} name={"tag"} />
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => {
                            setEditItem(null);
                        }}
                        variant="contained"
                    >
                        CANCEL
                    </Button>
                    <Button
                        type="submit"
                        size="small"
                        color="secondary"
                        variant="contained"
                    >
                        SAVE
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}

export default AddTag;
