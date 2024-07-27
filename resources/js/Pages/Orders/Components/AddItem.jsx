import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Divider,
    // Avatar,
    Stack,
    Typography,
} from "@mui/material";
// import { styled } from "@mui/material/styles";

import React, {
    // useState,
    useEffect,
    // useRef
} from "react";
import { FormInputText } from "./FormInputText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "../../../apis/apiCalls";
import { FormMultiInput } from "./FormMultiInput";
// import ImageUploader from "./ImageUploader";
// import IMAGE from "./image.png";

const validator = yup.object({
    item_name: yup.string().required(),
    category: yup.string().required(),
    unit_price: yup.number().required(),
    description: yup.string().required(),
});

// const dataURLtoFile = (dataurl, filename) => {
//     const arr = dataurl.split(",");
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n) {
//         u8arr[n - 1] = bstr.charCodeAt(n - 1);
//         n -= 1; // to make eslint happy
//     }
//     return new File([u8arr], { type: mime });
// };
function AddItem({ editItem, setEditItem, options }) {
    // const [imageUpload, setImageUpload] = useState(false);
    // const [checkImageEdited, setcheckImageEdited] = useState(false);
    // const [cropData, setCropData] = useState(null);

    const { control, reset, handleSubmit, watch } = useForm({
        resolver: yupResolver(validator),
        defaultValues: {
            item_name: "",
            category: "",
            unit_price: "",
            description: "",
            bgColor: "#4f33db",
            txtColor: "#ffffff",
            item_id: null,
            tags: [],
        },
        mode: "onBlur",
    });

    useEffect(() => {
        if (editItem) {
            reset({
                item_id: editItem.item_id,
                item_name: editItem.item_name,
                category: editItem.category,
                unit_price: editItem.unit_price,
                description: editItem.description,
                bgColor: editItem.bgColor,
                txtColor: editItem.txtColor,
                tags: editItem.tags,
            });
        } else {
            reset();
        }
    }, [editItem]);

    const onSubmit = (values) => {
        // const formData = new FormData();
        // for (let [key, value] of Object.entries(values)) {
        //     formData.append(key, value);
        // }

        // formData.append(
        //     "image",
        //     checkImageEdited ? dataURLtoFile(cropData) : null
        // );

        postData("/orders/save-item", values).then((response) => {
            if (response.status) {
                alert("Item Saved");
                setEditItem(null);
                // setImageUpload(null);
                // setcheckImageEdited(null);
                // setCropData(null);
            } else {
                alert(response.message);
            }
        });
    };
    return (
        <Card>
            <CardHeader subheader="ADD/EDIT ITEM" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Divider />
                <CardContent>
                    <FormInputText
                        label="Item Name"
                        control={control}
                        name={"item_name"}
                    />
                    <FormInputText
                        label="Category"
                        control={control}
                        name={"category"}
                    />
                    <FormInputText
                        label="Unit Price"
                        type={"number"}
                        control={control}
                        name={"unit_price"}
                    />
                    <FormMultiInput
                        label="Tags"
                        options={options}
                        control={control}
                        name={"tags"}
                    />
                    <FormInputText
                        label="Description"
                        multiline={true}
                        control={control}
                        name={"description"}
                    />
                    <FormInputText
                        label="Background Color"
                        control={control}
                        name={"bgColor"}
                        type={"color"}
                    />

                    <FormInputText
                        label="Text Color"
                        control={control}
                        name={"txtColor"}
                        type={"color"}
                    />
                    <Stack
                        justifyContent={"center"}
                        alignItems={"center"}
                        mt={3}
                    >
                        <Stack
                            sx={{
                                bgcolor: watch("bgColor"),
                                width: 150,
                                height: 70,
                                borderRadius: 2,
                            }}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Typography
                                sx={{ color: watch("txtColor") }}
                                flexWrap={true}
                                flex={true}
                            >
                                {watch("item_name")}
                            </Typography>
                        </Stack>
                    </Stack>
                    {/* <Stack justifyContent={"center"} alignItems={"center"}>
                        <Avatar
                            variant="rounded"
                            alt="image"
                            onClick={() => setImageUpload(true)}
                            src={checkImageEdited ? cropData : IMAGE}
                            sx={{ width: 150, height: 150 }}
                        />
                    </Stack>
                    <ImageUploader
                        open={imageUpload}
                        handleClose={() => setImageUpload(false)}
                        setcheckImageEdited={setchec
                        kImageEdited}
                        setCropData={setCropData}
                    /> */}
                </CardContent>
                <Divider />
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

export default AddItem;
