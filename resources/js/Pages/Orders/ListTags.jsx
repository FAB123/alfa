import { Grid, Paper, Box, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import TopBar from "../General/TopBar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddTag from "./Components/AddTag";
import { router, usePage } from "@inertiajs/react";
import DataTable from "react-data-table-component";
import { getData } from "../../apis/apiCalls";

function ListTags() {
    const { tags } = usePage().props;
    const [editItem, setEditItem] = useState(null);

    const deleteTag = (item) => {
        if (confirm("Are you sure delete item?")) {
            getData(`/orders/delete-tag/${item}`).then((response) => {
                if (response.status) {
                    alert("Item Deleted Successfully");
                    router.reload();
                }
            });
        }
    };

    const columns = [
        {
            name: "",
            selector: (row) => row.tag,
            sortable: true,
            sortField: "tag",
        },
        {
            name: "",
            button: true,
            cell: (row) => (
                <Stack direction={"row"}>
                    <IconButton size="small" onClick={() => setEditItem(row)}>
                        <EditIcon fontSize="small" color="success" />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteTag(row.id)}>
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <TopBar />
            <Grid container p={7} spacing={2}>
                <Grid item md={9} xs={12}>
                    <Paper>
                        <DataTable
                            title="Tag Lists"
                            columns={columns}
                            data={tags}
                            fixedHeader={true}
                            dense={true}
                        />
                    </Paper>
                </Grid>
                <Grid item md={3} xs={12}>
                    <AddTag editItem={editItem} setEditItem={setEditItem} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ListTags;
