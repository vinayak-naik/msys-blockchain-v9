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
import { getLotteryParticipants } from "../../web3-interface/services/lottery/get-participants";
import { getLotteryParticipantsLength } from "../../web3-interface/services/lottery/get-participants-length";
import { getUserByAddress } from "../../web3-interface/services/user/get-user-by-address";
import UserDetailsDialog from "../dialogs/user-details-dialog";

const LotteryParticipants = (props: any) => {
  const { lotteryDetails } = props;
  const { query } = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noParticipants, setNoParticipants] = useState(false);
  const [participants, setParticipants] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const count = 7;
  const lotteryId = Number(query.lotteryId);

  const getUser = async (address: string) => {
    const res = await getUserByAddress(address);
    if (!res.success) return;
    setUser(res.data);
    setOpen(true);
  };

  const getParticipants = async () => {
    const totalParticipants = await getLotteryParticipantsLength(lotteryId);
    if (!totalParticipants.success) return;
    if (totalParticipants.data === "0") {
      setNoParticipants(true);
      return;
    }
    const pageCount = Math.ceil(Number(totalParticipants.data) / count);
    setTotalPages(pageCount);
    const from = (page - 1) * count;
    const to = from + count;
    const res = await getLotteryParticipants(
      lotteryId,
      Number(totalParticipants.data),
      from,
      to
    );
    setParticipants(res.data);
  };

  useEffect(() => {
    if (query && query.lotteryId) {
      getParticipants();
    }
  }, [query.lotteryId, page]); // eslint-disable-line
  if (participants.length)
    return (
      <div>
        <TableContainer component={Paper} sx={paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={sx.tableCell}>Sl No.</TableCell>
                <TableCell sx={sx.tableCell}>Wallet Address</TableCell>
                <TableCell sx={sx.tableCell}>Paid Amount</TableCell>
                <TableCell sx={sx.tableCell}>Lottery Amount</TableCell>
                <TableCell sx={sx.tableCell}>Fees</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "#082c05",
                    },
                  }}
                  onClick={() => getUser(item)}
                >
                  <TableCell sx={sx.tableCell}>{index + 1}</TableCell>
                  <TableCell sx={sx.tableCell}>{item}</TableCell>
                  <TableCell sx={sx.tableCell}>
                    {lotteryDetails.amount}&nbsp;MSCN
                  </TableCell>
                  <TableCell sx={sx.tableCell}>
                    {lotteryDetails.amount * 0.99}&nbsp;MSCN
                  </TableCell>
                  <TableCell sx={sx.tableCell}>
                    {lotteryDetails.amount * 0.01}&nbsp;MSCN
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
        <UserDetailsDialog
          user={user}
          open={open}
          handleClose={() => setOpen(false)}
        />
      </div>
    );
  if (noParticipants) return <div style={styleObj}>No Participants</div>;
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default LotteryParticipants;

// ================================Objects=============================

const styleObj = {
  height: "50vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
};

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
