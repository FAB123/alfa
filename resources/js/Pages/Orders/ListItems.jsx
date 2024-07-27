import React, { useState } from "react";
import TableHelper from "../General/TableHelper";
import TopBar from "../General/TopBar";
import { Grid, Stack, IconButton } from "@mui/material";
import AddItem from "./Components/AddItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getData } from "../../apis/apiCalls";
import { router, usePage } from "@inertiajs/react";

function ListItems() {
    const [editItem, setEditItem] = useState(false);
    const { tags } = usePage().props;

    const deleteItem = (item) => {
        if (confirm("Are you sure delete item?")) {
            getData(`/orders/delete-item/${item}`).then((response) => {
                if (response.status) {
                    alert("Item Deleted Successfully");
                    router.reload();
                }
            });
        }
    };

    const columns = [
        {
            name: "Item Name",
            selector: (row) => row.item_name,
            sortable: true,
            sortField: "item_name",
        },
        {
            name: "Category",
            selector: (row) => row.category,
            sortable: true,
            sortField: "category",
        },
        {
            name: "Unit Price",
            selector: (row) => row.unit_price,
            sortable: true,
            sortField: "unit_price",
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
            sortField: "description",
        },
        {
            name: "",
            button: true,
            cell: (row) => (
                <Stack direction={"row"}>
                    <IconButton size="small" onClick={() => setEditItem(row)}>
                        <EditIcon fontSize="small" color="success" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => deleteItem(row.item_id)}
                    >
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <>
            <TopBar />
            <Grid container sx={{ pt: 4 }} spacing={2}>
                <Grid item md={9}>
                    <TableHelper
                        url="/orders/items"
                        title="List Items"
                        columns={columns}
                    />
                </Grid>
                <Grid item md={3}>
                    <AddItem
                        editItem={editItem}
                        options={tags}
                        setEditItem={setEditItem}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default ListItems;
