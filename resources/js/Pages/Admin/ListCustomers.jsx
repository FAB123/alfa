import { Button, Container, IconButton, Stack } from "@mui/material";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Head, router, usePage } from "@inertiajs/react";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function ListCustomers() {
    const { customers } = usePage().props;
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteAccount = (id) => {
        router.reload({ only: ["customers"] });
    };

    return (
        <Container>
            <Head title="DASHBOARD" />
            <Stack spacing={2}>
                <Stack alignItems={"end"}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            router.get(`/admin/add_customer`);
                        }}
                    >
                        NEW
                    </Button>
                </Stack>
                <Stack>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ACCOUNT NAME</TableCell>
                                    <TableCell align="center">
                                        SHOP NAME
                                    </TableCell>
                                    <TableCell align="center">
                                        SHOP NAME AR
                                    </TableCell>
                                    <TableCell align="center">EMAIL</TableCell>
                                    <TableCell align="center">
                                        Total Couters
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map((row, key) => (
                                    <TableRow
                                        key={key}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.shop_name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.shop_name_ar}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.counters_count}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack
                                                direction={"row"}
                                                justifyContent={"flex-end"}
                                            >
                                                <IconButton
                                                    color="success"
                                                    onClick={() => {
                                                        router.get(
                                                            `/admin/detail_customer/${row.encrypted_user}`
                                                        );
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        deleteAccount(
                                                            row.encrypted_user
                                                        );
                                                    }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={100}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Stack>
            </Stack>
        </Container>
    );
}

export default ListCustomers;
