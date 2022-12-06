import React, { useState } from "react";
import { Paper } from "@mui/material";
import style from "../../styles/pages/matchDetails.module.css";

const sx = {
  backgroundColor: "#00000070",
  borderRadius: "10px",
  color: "white",
  border: "1.5px solid green",
};

export const MatchDetails = (props: any) => {
  const { matchDetails, refresh } = props;
  const [reloading, setReloading] = useState(false);

  const reload = () => {
    refresh();
    setReloading(true);
    setTimeout(() => {
      setReloading(false);
    }, 2000);
  };

  const {
    statusString,
    date,
    matchId,
    totalParticipants,
    totalAmount,
    team1,
    team2,
    won,
    statusCode,
    game,
    time,
  } = matchDetails;
  const totalFees = ((totalAmount + totalAmount * 0.01) * 0.01).toFixed(2);
  return (
    <Paper sx={sx} className={style.matchDetails}>
      <div className={style.textBoxContainer}>
        <div className={style.textBox}>
          <div className={style.textContainer}>
            <div className={style.textHead}>Game:</div>
            <div className={style.text}>{game}</div>
          </div>
          <div className={style.textContainer}>
            <div className={style.textHead}>Status:</div>
            <div className={style.text}>{statusString}</div>
          </div>
        </div>
      </div>
      <div className={style.textBoxContainer}>
        <div className={style.textBox}>
          <div className={style.textContainer}>
            <div className={style.textHead}>Date:</div>
            <div className={style.text}>{date}</div>
          </div>
          <div className={style.textContainer}>
            <div className={style.textHead}>Time:</div>
            <div className={style.text}>{time}</div>
          </div>
        </div>

        <div className={style.textBox}>
          <div className={style.textContainer}>
            <div className={style.textHead}>Match Id:</div>
            <div className={style.text}>{matchId}</div>
          </div>
          <div className={style.textContainer}>
            <div className={style.textHead}>Total Participants:</div>
            <div className={style.text}>{totalParticipants}</div>
          </div>
        </div>
      </div>

      <div className={style.textBoxContainer}>
        <div className={style.textBox}>
          <div className={style.textContainer}>
            <div className={style.textHead}>Total Amount:</div>
            <div className={style.text}>{totalAmount}&nbsp;MSCN</div>
          </div>
          <div className={style.textContainer}>
            <div className={style.textHead}>Total Fees:</div>
            <div className={style.text}>{totalFees}&nbsp;MSCN</div>
          </div>
        </div>
        <div className={style.textBox}>
          {statusCode === 3 && (
            <div className={style.textContainer}>
              <div className={style.textHead}>Won:</div>
              <div className={style.text}>
                {won === 1 ? team1 : won === 2 ? team2 : "Pending"}
              </div>
            </div>
          )}
          <div className={style.textContainer}>
            <button onClick={reload} className={style.statusButton}>
              {reloading ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>
      </div>
    </Paper>
  );
};
