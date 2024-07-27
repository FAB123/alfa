import {
    Button,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { postData } from "../../apis/apiCalls";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { router } from "@inertiajs/react";

function UpdateShopImage({ account }) {
    const [images, setImages] = useState(account.images ? account.images : []);
    const [value, setValue] = useState([]);
    const [edit, setEdit] = useState(-1);

    const updateItem = () => {
        if (edit >= 0) {
            setImages([
                ...images.slice(0, edit),
                value,
                ...images.slice(edit + 1),
            ]);
            setEdit(-1);
        } else {
            setImages([...images, value]);
        }
        setValue("");
    };

    const deleteImage = (index) => {
        setImages([...images.slice(0, index), ...images.slice(index + 1)]);
    };

    function handleSubmit(e) {
        postData("/admin/save-shop-image", {
            images: images,
            encrypted_user: account.encrypted_user,
        }).then((response) => {
            if (!response.error) {
                router.reload();
            } else {
                alert("error");
            }
        });
    }
    return (
        <Paper sx={{ padding: 1 }}>
            <List dense={true}>
                {images.map((item, index) => (
                    <Stack key={index}>
                        <ListItem>
                            <ListItemText primary={item} />
                            <ListItemIcon>
                                <IconButton
                                    onClick={() => {
                                        setEdit(index);
                                        setValue(item);
                                    }}
                                >
                                    <EditIcon
                                        color="success"
                                        fontSize="small"
                                    />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        deleteImage(index);
                                    }}
                                >
                                    <DeleteIcon
                                        color="error"
                                        fontSize="small"
                                    />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                        <Divider component="li" />
                    </Stack>
                ))}
            </List>

            <TextField
                label="IMAGE URL"
                size="small"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={updateItem}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button disabled={images.length === 0} onClick={handleSubmit}>
                SAVE
            </Button>
        </Paper>
    );
}

export default UpdateShopImage;
