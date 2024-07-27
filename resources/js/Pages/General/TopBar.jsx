import {
    AppBar,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Typography,
    MenuList,
} from "@mui/material";
import React from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import ExtensionIcon from "@mui/icons-material/Extension";
import { router, usePage } from "@inertiajs/react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import AttachmentIcon from "@mui/icons-material/Attachment";
function TopBar() {
    const { user } = usePage().props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ top: 0, backgroundColor: "#fff" }}>
                <Stack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    direction={"row"}
                >
                    <Typography
                        variant="button"
                        fontWeight={800}
                        fontSize={16}
                        color="#f00"
                    >
                        {user.shop_name} - {user.shop_name_ar}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontSize={12}
                        color="#000"
                    >
                        T: {user.shop_id}
                    </Typography>
                    <IconButton onClick={handleClick}>
                        <MenuIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </AppBar>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuList dense>
                    <MenuItem onClick={() => router.replace("/token")}>
                        <ListItemIcon>
                            <RepeatOneIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Update Token</ListItemText>
                    </MenuItem>
                    {user.enable_ordering && (
                        <>
                            <MenuItem onClick={() => router.replace("/orders")}>
                                <ListItemIcon>
                                    <ReceiptLongIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Manage Orders</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    router.replace("/orders/manage-items")
                                }
                            >
                                <ListItemIcon>
                                    <ExtensionIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Manage Item</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    router.replace("/orders/manage-tags")
                                }
                            >
                                <ListItemIcon>
                                    <AttachmentIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Manage Tags</ListItemText>
                            </MenuItem>
                        </>
                    )}
                    <MenuItem onClick={() => router.replace("/logout")}>
                        <ListItemIcon>
                            <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}

export default TopBar;
