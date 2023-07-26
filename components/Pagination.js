import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            marginTop: theme.spacing(2),
        },
        "& .MuiPaginationItem-root": {
            borderRadius: "50%", // Para hacer que los botones de paginación sean circulares
        },
    },
}));

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => onPageChange(page)}
                shape="rounded"
                variant="outlined"
            />
        </div>
    );
};

export default CustomPagination;
