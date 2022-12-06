import React, { useEffect, useState } from "react";
import style from "../../styles/pages/betting.module.css";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { getMatches } from "../../web3-interface/services/betting/get-matches";
import HeaderComponent from "../../components/header/header";
// import { getStoredFile } from "../../web3-interface/call-api/get-stored-file";

const MsysBetting = () => {
  const [data, setData] = useState<any>("");
  let ignore = false;

  const getAllMatches = async () => {
    // const res = await getStoredFile("matches");
    // if (res.success) {
    //   console.log(res);
    //   setData(res);
    // } else {
    //   const response = await getMatches();
    //   console.log(response);
    //   setData(response);
    // }
    const response = await getMatches();
    console.log(response);
    setData(response);
  };

  useEffect(() => {
    if (!ignore) getAllMatches();
    ignore = true; // eslint-disable-line
  }, []); // eslint-disable-line

  if (data && data.success)
    return (
      <div className={style.container}>
        <HeaderComponent />
        <div className={style.containerLayer}>
          <div className={style.innerContainer}>
            <h1 className={style.header}>MSys Betting</h1>
            <div className={style.gridContainer}>
              <div className={style.gridItem}>
                <div className={style.matchHeader}>Upcomming</div>
                <div className={style.cardMainContainer}>
                  <MatchCards matches={data?.data?.upcomming} />
                </div>
              </div>
              <div className={style.gridItem}>
                <div className={style.matchHeader}>Active</div>
                <div className={style.cardMainContainer}>
                  <MatchCards matches={data?.data?.active} />
                </div>
              </div>
              <div className={style.gridItem}>
                <div className={style.matchHeader}>Completed</div>
                <div className={style.cardMainContainer}>
                  <MatchCards matches={data?.data?.completed} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default MsysBetting;

// ================================ getServerSideProps =============================

// export async function getServerSideProps() {
//   const path = "/tmp/matches.json";

//   try {
//     const exists = existsSync(path);
//     if (!exists) {
//       return { props: { success: false, data: [], message: "File not found" } };
//     }
//     const rawFile = readFileSync(path, "utf-8");
//     const file = JSON.parse(rawFile);
//     return {
//       props: { success: true, data: file, message: "From stored data" },
//     };
//   } catch (error) {
//     return {
//       props: { success: false, data: [], message: "Failed to get file" },
//     };
//   }
// }
// ================================Objects=============================

const styleObj = {
  height: "80vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const MatchCards = (props: any) => {
  const { matches } = props;
  const { push } = useRouter();
  return (
    <>
      {matches.map((item: any) => (
        <div
          key={item.matchId}
          className={style.cardContainer}
          onClick={() =>
            item.statusCode !== "1" ? push(`/betting/${item.matchId}`) : null
          }
        >
          <div className={style.cardInnerContainer}>
            <div className={style.cardRow1}>
              <div className={style.cardText}>Game:&nbsp;{item.game}</div>
              <div className={style.cardText}>matchId:&nbsp;{item.matchId}</div>
            </div>
            <div className={style.cardRow1}>
              <div className={style.cardText}>date:&nbsp;{item.date}</div>
              <div className={style.cardText}>Time:&nbsp;{item.time}</div>
            </div>
            <div className={style.cardRow2}>
              <div className={style.cardTeamName}>{item.team1}</div>
              <div className={style.vs}>VS</div>
              <div className={style.cardTeamName}>{item.team2}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
