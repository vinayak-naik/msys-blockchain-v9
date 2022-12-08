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
import UserDetailsDialog from "../../components/dialogs/user-details-dialog";
import HeaderComponent from "../../components/header/header";
import style from "../../styles/pages/participants.module.css";
import { getParticipants } from "../../web3-interface/services/betting/get-participants";
import { getParticipantsLength } from "../../web3-interface/services/betting/get-participants-length";
import { getUserByAddress } from "../../web3-interface/services/user/get-user-by-address";

const Participants = () => {
  const { query } = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [participants, setParticipants] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const count = 8;
  const matchId = Number(query.id);
  const team = Number(query.team);
  const total = Number(query.total);
  const teamTotal = Number(query.teamTotal);
  const statusCode = Number(query.statusCode);

  const getParticipantslist = async () => {
    const totalParticipants = await getParticipantsLength(matchId, team);
    const pageCount = Math.ceil(Number(totalParticipants) / count);
    setTotalPages(pageCount);
    const from = (page - 1) * count;
    const to = from + count;
    const participantsArr = await getParticipants(
      matchId,
      team,
      Number(totalParticipants),
      from,
      to
    );
    setParticipants(participantsArr);
  };

  useEffect(() => {
    if (query && query.id) {
      getParticipantslist();
    }
  }, [query.id, page]); // eslint-disable-line

  const getUser = async (address: string) => {
    const res = await getUserByAddress(address);
    if (!res.success) return;
    setUser(res.data);
    setOpen(true);
  };
  if (participants.length)
    return (
      <>
        <HeaderComponent />
        <div className={style.container}>
          <div className={style.innerContainer}>
            <div>
              <Paper sx={paper}>
                <div className={style.headBox}>
                  Team {query.name} Participants
                </div>
              </Paper>
              <TableContainer component={Paper} sx={paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={sx.tableCell}>Sl&nbsp;No.</TableCell>
                      <TableCell sx={sx.tableCell}>Wallet Address</TableCell>
                      {/* <TableCell sx={sx.tableCell}>Paid Amount</TableCell> */}
                      <TableCell sx={sx.tableCell}>Bet Amount</TableCell>
                      <TableCell sx={sx.tableCell}>Fees</TableCell>
                      <TableCell sx={sx.tableCell}>
                        {statusCode === 3 ? "Profit" : "Expected Profit"}
                      </TableCell>
                      <TableCell sx={sx.tableCell}>Total Amount(%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participants.map((item: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            backgroundColor: "rgb(4 65 95)",
                          },
                        }}
                        onClick={() => getUser(item.participantAddress)}
                      >
                        <TableCell sx={sx.tableCell}>{index + 1}</TableCell>
                        <TableCell sx={sx.tableCell}>
                          {item.participantAddress}
                        </TableCell>
                        {/* <TableCell sx={sx.tableCell}>
                          {((item.amount * 100) / 99).toFixed(2)}&nbsp;MSCN
                        </TableCell> */}
                        <TableCell sx={sx.tableCell}>
                          {item.amount}&nbsp;MSCN
                        </TableCell>
                        <TableCell sx={sx.tableCell}>
                          {(item.amount / 99).toFixed(2)}&nbsp;MSCN
                        </TableCell>
                        <TableCell sx={sx.tableCell}>
                          {((item.amount / teamTotal) * (total + 1000)).toFixed(
                            2
                          )}
                          &nbsp;MSCN
                        </TableCell>
                        <TableCell sx={sx.tableCell}>
                          {((item.amount * 100) / total).toFixed(2)}&nbsp;MSCN
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
                        backgroundColor: "#165c21",
                      },
                    }}
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                  />
                </div>
              </Paper>
            </div>
          </div>
          <UserDetailsDialog
            user={user}
            open={open}
            handleClose={() => setOpen(false)}
          />
        </div>
      </>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default Participants;

// ================================Objects=============================

const styleObj = {
  height: "85vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  backgroundColor: "#00000070",
  borderRadius: "10px",
  color: "rgb(215, 215, 215)",
  border: "1.5px solid green",
  marginBottom: "10px",
};
