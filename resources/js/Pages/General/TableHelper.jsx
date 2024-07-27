import { Button, Paper, TextField } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

function TableHelper({ url, title, columns }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(10);

    const [perPage, setPerPage] = useState(10);
    const [keyword, setKeyWord] = useState("1");
    const [sortItem, setSortitem] = useState("item_id");
    const [sortDir, setSortdir] = useState("asc");

    const fetchDatas = async (page) => {
        setLoading(true);

        const response = await axios.get(
            `${url}/${page}/${perPage}/${keyword}/${sortItem}/${sortDir}`
        );

        setCurrentPage(page);
        setData(response.data.table.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };
    const handlePageChange = (page) => {
        fetchDatas(page);
    };

    const handleSort = async (column, sortDirection) => {
        setLoading(true);
        console.log(column);
        const response = await axios.get(
            `${url}/${currentPage}/${perPage}/${keyword}/${column.sortField}/${sortDirection}`
        );
        setData(response.data.table.data);
        setSortitem(column);
        setSortdir(sortDirection);
        setLoading(false);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        const response = await axios.get(
            `${url}/${page}/${newPerPage}/${keyword}/${sortItem}/${sortDir}`
        );
        setData(response.data.table.data);
        setCurrentPage(page);
        setPerPage(newPerPage);
        setLoading(false);
    };

    useEffect(() => {
        fetchDatas(1);
    }, []);

    return (
        <Paper elevation={24}>
            <DataTable
                title={title}
                selectableRows={true}
                columns={columns}
                data={data}
                progressPending={loading}
                fixedHeader={true}
                dense={true}
                // actions={<Button>sad</Button>}
                // subHeader={"j"}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onSort={handleSort}
                sortServer
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </Paper>
    );
}

export default TableHelper;
