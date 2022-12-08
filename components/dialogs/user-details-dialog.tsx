import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import style from "../../styles/pages/participants.module.css";

export default function UserDetailsDialog(props: any) {
  const { open, handleClose, user } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Participant Details</DialogTitle>
        <DialogContent>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            className={style.userDetailsDialog}
          >
            <div>
              <h4>User Id: &nbsp;</h4>
              <span> {user?.userId}</span>
            </div>
            <div>
              <h4>Name: &nbsp;</h4>
              <span> {user?.name}</span>
            </div>
            <div>
              <h4>Email: &nbsp;</h4>
              <span>{user?.email}</span>
            </div>
            <div>
              <h4>Wallet&nbsp;Address: &nbsp;</h4>
              <span>{user?.walletAddress}</span>
            </div>
            <div>
              <h4>Status: &nbsp;</h4>
              <span>{user?.status}</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
