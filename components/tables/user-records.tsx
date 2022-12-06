import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import style from "../../styles/pages/userProfile.module.css";
import { getRecordsLength } from "../../web3-interface/services/user/get-records-length";
import { getRecords } from "../../web3-interface/services/user/get-records";
const RecordsTable = (props: any) => {
  const { walletAddress } = props;
  const { query } = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [records, setRecords] = useState<any>([]);
  const [noRecords, setNoRecords] = useState(false);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const count = 10;

  const getAllRecords = async () => {
    const response = await getRecordsLength(walletAddress);
    const totalRecords = Number(response.data);
    if (totalRecords === 0) {
      setNoRecords(true);
      return;
    }
    console.log(totalRecords);
    const pageCount = Math.ceil(Number(totalRecords) / count);
    setTotalPages(pageCount);
    const from = (page - 1) * count;
    const to = from + count;
    const res = await getRecords(walletAddress, Number(totalRecords), from, to);
    console.log(res);
    setRecords(res.data);
  };

  useEffect(() => {
    if (query && walletAddress) {
      getAllRecords();
    }
  }, [walletAddress, page]); // eslint-disable-line
  if (records.length)
    return (
      <div>
        <div className={style.headContainer}>
          <h1>Recent Transactions</h1>
        </div>
        <TableContainer component={Paper} sx={paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={sx.tableCell}>Sl No.</TableCell>
                <TableCell sx={sx.tableCell}>Id</TableCell>
                <TableCell sx={sx.tableCell}>Game Category</TableCell>
                <TableCell sx={sx.tableCell}>Team Selected</TableCell>
                <TableCell sx={sx.tableCell}>Amount</TableCell>
                <TableCell sx={sx.tableCell}>Fees</TableCell>
                {/* <TableCell sx={sx.tableCell}>Team Selected</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "#082c05",
                    },
                  }}
                >
                  <TableCell sx={sx.tableCell}>{index + 1}</TableCell>
                  <TableCell sx={sx.tableCell}>{item.id}</TableCell>
                  <TableCell sx={sx.tableCell}>{item.category}</TableCell>
                  <TableCell sx={sx.tableCell}>{item.teamSelected}</TableCell>
                  <TableCell sx={sx.tableCell}>
                    {(item.amount * 0.99).toFixed(2)}
                  </TableCell>
                  <TableCell sx={sx.tableCell}>
                    {(item.amount * 0.01).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Paper sx={paper} style={{ marginBottom: "10vh" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              color="primary"
              sx={{
                button: {
                  color: "white",
                },
                ".Mui-selected": {
                  backgroundColor: "#155815",
                },
              }}
              count={totalPages}
              page={page}
              onChange={handleChange}
            />
          </div>
        </Paper>
      </div>
    );
  return (
    <div className={style.loadingPage}>
      <div className={style.headContainer}>
        <h1>Recent Transactions</h1>
      </div>
      {!walletAddress ? (
        <div>Please add Wallet Address</div>
      ) : noRecords ? (
        <div>No Transactions found</div>
      ) : (
        <CircularProgress color="success" />
      )}
    </div>
  );
};

export default RecordsTable;

// ================================Objects=============================

const sx = {
  tableCell: {
    textTransform: "capitalize",
    cursor: "pointer",
    textAlign: "center",
    color: "rgb(215, 215, 215)",
  },
};
const paper = {
  backgroundColor: "#00000030",
  borderRadius: "10px",
  color: "rgb(215, 215, 215)",
  border: "1.5px solid green",
  marginBottom: "10px",
};
