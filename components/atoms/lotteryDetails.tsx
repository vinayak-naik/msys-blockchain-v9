import { Paper } from "@mui/material";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import style from "../../styles/pages/lotteryDetails.module.css";
import { getUserByEmail } from "../../web3-interface/services/user/get-user-by-email";
import ParticipatePromptDialog from "../dialogs/participate-prompt-dialog";

declare var window: any;

const paper = {
  backgroundColor: "#00000000",
  borderRadius: "10px",
  color: "white",
  border: "1.5px solid green",
};

const LotteryDetails = (props: any) => {
  const { push, back } = useRouter();
  const [session]: any = useSession();
  const { data, refresh, openDialog, id } = props;
  const [reloading, setReloading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [promptDialog, setPromptDialog] = useState({
    open: false,
    actionName: "",
    message: "",
    action: function () {},
  });

  const reload = () => {
    refresh();
    setReloading(true);
    setTimeout(() => {
      setReloading(false);
    }, 2000);
  };

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
    if (data.timestamp < +new Date() / 1000) {
      setPromptDialog({
        open: true,
        actionName: "go back",
        message: `Game is expired at ${data.time}`,
        action: function () {
          back();
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
      query: { type: 2, id, name: data.lotteryName, price: data.amount },
    });
  };
  useEffect(() => {
    if (session) getWalletAddress(session?.user?.email);
  }, [session]); // eslint-disable-line
  return (
    <>
      <Paper sx={paper}>
        <div className={style.lotteryNamePaper}>
          <h3>{data.lotteryName}</h3>
        </div>
      </Paper>
      <Paper sx={paper} className={style.matchDetails}>
        <div className={style.textBoxContainer}>
          <div className={style.textBox}>
            <div className={style.textContainer}>
              <div className={style.textHead}>Status:</div>
              <div className={style.text}>{data.statusString}</div>
            </div>
            <div className={style.textContainer}>
              <div className={style.textHead}>Date:</div>
              <div className={style.text}>{data.date}</div>
            </div>
          </div>
          <div className={style.textBox}>
            <div className={style.textContainer}>
              <div className={style.textHead}>Lottery Id:</div>
              <div className={style.text}>{data.lotteryId}</div>
            </div>
            <div className={style.textContainer}>
              <div className={style.textHead}>Total Participants:</div>
              <div className={style.text}>{data.length}</div>
            </div>
          </div>
        </div>

        <div className={style.textBoxContainer}>
          <div className={style.textBox}>
            <div className={style.textContainer}>
              <div className={style.textHead}>Total Amount:</div>
              <div className={style.text}>{data.totalAmount}&nbsp;MSCN</div>
            </div>
            <div className={style.textContainer}>
              <div className={style.textHead}>Total Fees:</div>
              <div className={style.text}>{data.totalFees}&nbsp;MSCN</div>
            </div>
          </div>
          <div className={style.textBox}>
            <>
              <div className={style.textContainer}>
                <button onClick={participate} className={style.statusButton}>
                  Participate
                </button>
              </div>
              <div className={style.textContainer}>
                <button onClick={reload} className={style.statusButton}>
                  {reloading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </>
          </div>
          <div className={style.textBox}>
            {data.statusCode === 3 && (
              <div className={style.textContainer}>
                <button onClick={openDialog} className={style.statusButton}>
                  Lottery Winners
                </button>
              </div>
            )}
          </div>
        </div>
        <ParticipatePromptDialog
          promptDialog={promptDialog}
          setPromptDialog={(e: any) => setPromptDialog(e)}
        />
      </Paper>
      <Paper sx={paper}>
        <div className={style.lotteryNamePaper}>
          <h3>Participants</h3>
        </div>
      </Paper>
    </>
  );
};

export default LotteryDetails;
