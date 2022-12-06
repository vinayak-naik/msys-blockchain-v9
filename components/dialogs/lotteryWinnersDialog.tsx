import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import style from "../../styles/components/dialog/dialog.module.css";
import { Dialog, DialogTitle, Typography } from "@mui/material";
import { getLotteryWinners } from "../../web3-interface/services/lottery/get-lottery-winners";

const sx = {
  tableCell: {
    textTransform: "capitalize",
    cursor: "pointer",
    textAlign: "center",
  },
};

export const LotteryWinnersDialog = (props: any) => {
  const { handleClose, openWinners, id, lotteryDetails } = props;
  const [winners, setWinners] = useState<any>([]);

  const getWinners = async () => {
    if (!openWinners) return;
    const data = await getLotteryWinners(id);
    if (!data.success) return;
    setWinners(data.data);
  };

  useEffect(() => {
    getWinners();
  }, [openWinners]); // eslint-disable-line

  return (
    <Dialog open={openWinners} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div
          style={{ width: "100%", textAlign: "center", paddingBottom: "10px" }}
        >
          <Typography variant="h5" textTransform="capitalize">
            Lottery Winners
          </Typography>
        </div>
        <TableContainer style={{ border: "1px solid lightgrey" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={sx.tableCell}>Sl No.</TableCell>
                <TableCell sx={sx.tableCell}>Wallet Address</TableCell>
                <TableCell sx={sx.tableCell}>Total Amount(%)</TableCell>
                <TableCell sx={sx.tableCell}>Amount Won</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {winners.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={sx.tableCell}>{index + 1}</TableCell>
                  <TableCell sx={sx.tableCell}>{item}</TableCell>

                  <TableCell sx={sx.tableCell}>
                    {index === 0 ? 50 : index === 1 ? 30 : 20}%
                  </TableCell>
                  <TableCell sx={sx.tableCell}>
                    {(
                      (index === 0 ? 0.5 : index === 1 ? 0.3 : 0.2) *
                      lotteryDetails.totalAmount
                    ).toFixed(2)}
                    &nbsp;MSCN
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            margin: "0.5px 0",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>
      </DialogTitle>
    </Dialog>
  );
};

export const MemoizedMovie = React.memo(LotteryWinnersDialog);
