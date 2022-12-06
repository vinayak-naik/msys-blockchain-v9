import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import CircularProgressBar from "../reusable/circularProgressBar";
import style from "../../styles/pages/matchDetails.module.css";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";
import ParticipatePromptDialog from "../dialogs/participate-prompt-dialog";
import { getUserByEmail } from "../../web3-interface/services/user/get-user-by-email";

declare var window: any;

const sx = {
  backgroundColor: "#00000070",
  borderRadius: "10px",
  color: "white",
  border: "1.5px solid green",
};

export const TeamDetails = (props: any) => {
  const [session]: any = useSession();
  const { matchDetails, teamDetails, team } = props;
  const { push } = useRouter();
  const [walletAddress, setWalletAddress] = useState("");
  const [promptDialog, setPromptDialog] = useState({
    open: false,
    actionName: "",
    message: "",
    action: function () {},
  });

  const getWalletAddress = async (email: string) => {
    const res = await getUserByEmail(email);
    if (!res.success) return;
    setWalletAddress(res.data);
  };

  const checkCondition = () => {
    if (!session) {
      setPromptDialog({
        open: true,
        actionName: "login",
        message: "Login is required for participation!",
        action: function () {
          signIn("google");
        },
      });
      return false;
    }
    if (!walletAddress) {
      setPromptDialog({
        open: true,
        actionName: "add wallet address",
        message: "Wallet address not yet added!",
        action: function () {
          push("/user");
        },
      });
      return false;
    }

    if (typeof window.ethereum === "undefined") {
      setPromptDialog({
        open: true,
        actionName: "install metamask",
        message: "Metamask application is required",
        action: function () {
          window.location.href = "https://metamask.io/download/";
        },
      });
      return false;
    }
    return true;
  };

  const participate = () => {
    const result = checkCondition();
    if (!result) return;
    push({
      pathname: "/participate",
      query: {
        type: 1,
        id: matchDetails.matchId,
        name: team === 1 ? matchDetails.team1 : matchDetails.team2,
        team,
      },
    });
  };
  const participantsList = () => {
    push({
      pathname: "/betting/participants",
      query: {
        id: matchDetails.matchId,
        name: team === 1 ? matchDetails.team1 : matchDetails.team2,
        team,
      },
    });
  };

  useEffect(() => {
    if (session) getWalletAddress(session?.user?.email);
  }, [session]); // eslint-disable-line

  return (
    <>
      <Paper sx={sx}>
        <div
          className={`${style.titleBoxNormal} ${
            matchDetails.statusCode === 3 && matchDetails.won === team
              ? style.titleBoxWon
              : matchDetails.statusCode === 3 && matchDetails.won !== 0
              ? style.titleBoxDefeat
              : style.titleBoxNorma
          }`}
        >
          {team === 1 ? matchDetails.team1 : matchDetails.team2}
        </div>
      </Paper>
      {matchDetails.statusCode === 3 && (
        <Paper sx={sx} className={style.progressContainer}>
          <CircularProgressBar
            percent={teamDetails.participantsPercent}
            pathColor="rgb(0 166 255)"
            label="Participants"
            tooltip={`Percentage of Total Participants of team india`}
          />
          <CircularProgressBar
            percent={teamDetails.amountPercent}
            pathColor="#1ec91e"
            label="Amount"
            tooltip={`Percentage of Total Amount Collected for team india`}
          />
        </Paper>
      )}
      <Paper sx={sx} className={style.teamDetails}>
        <div className={style.teamDetailsLeft}>
          <div className={style.textContainer}>
            <div className={style.textHead}>Participants:</div>
            <div className={style.text}>{teamDetails.length}</div>
          </div>
          <div className={style.textContainer}>
            <div className={style.textHead}>Amount:</div>
            <div className={style.text}>
              {teamDetails.totalAmount}&nbsp;MSCN
            </div>
          </div>
        </div>
        <div className={style.teamDetailsRight}>
          <div className={style.textContainer}>
            <div className={style.textHead}>
              Percentage of Total Participants:
            </div>
            <div className={style.text}>{teamDetails.participantsPercent}</div>
          </div>
          <div className={style.textContainer}>
            <div className={style.textHead}>Percentage of Total Amount:</div>
            <div className={style.text}>{teamDetails.amountPercent}</div>
          </div>
        </div>
      </Paper>
      <Paper sx={sx}>
        <div onClick={participantsList} className={style.participantsLink}>
          Participants List
        </div>
      </Paper>
      <Paper sx={sx}>
        <div onClick={participate} className={style.participateButton}>
          Participate for&nbsp;
          <span style={{ textTransform: "capitalize" }}>
            {team === 1 ? matchDetails.team1 : matchDetails.team2}
          </span>
        </div>
      </Paper>
      <ParticipatePromptDialog
        promptDialog={promptDialog}
        setPromptDialog={(e: any) => setPromptDialog(e)}
      />
    </>
  );
};
