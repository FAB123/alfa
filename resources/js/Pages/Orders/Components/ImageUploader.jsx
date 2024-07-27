import React, { useState } from "react";

import Button from "@mui/material/Button";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import BlockIcon from "@mui/icons-material/Block";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./demo.css";

import { Paper, Stack } from "@mui/material";

const Input = styled("input")({
    display: "none",
});

function ImageUploader(props) {
    const { setcheckImageEdited, setCropData, open, handleClose } = props;
    const [cropper, setCropper] = useState();
    const [image, setImage] = useState("");

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            setcheckImageEdited(true);
        }
    };

    const onChange = (e) => {
        e.preventDefault();
        let files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        // setShow(true);
    };

    return (
        <div>
            <Dialog
                onClose={handleClose}
                open={open}
                fullWidth
                maxWidth="sm"
                hideBackdrop={true}
            >
                <DialogTitle>CROP IMAGE</DialogTitle>
                <DialogContent dividers>
                    <Stack>
                        <Stack component={Paper} padding={2}>
                            <Cropper
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    minHeight: 300,
                                }}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false}
                                modal={true}
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                                guides={true}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <label>
                        <Input
                            accept="image/*"
                            onChange={onChange}
                            type="file"
                        />
                        <Button
                            // sx={{ m: 2 }}
                            variant="contained"
                            color="warning"
                            component="span"
                            startIcon={<FileUploadIcon />}
                        >
                            SELECT ANOTHER FILE
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SaveAltIcon />}
                        onClick={getCropData}
                    >
                        CROP & Select
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<BlockIcon />}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ImageUploader;
