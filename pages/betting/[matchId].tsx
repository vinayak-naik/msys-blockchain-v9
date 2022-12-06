import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MatchDetails } from "../../components/atoms/matchDetails";
import { TeamDetails } from "../../components/atoms/teamDetails";
import HeaderComponent from "../../components/header/header";
import style from "../../styles/pages/matchDetails.module.css";
import { getMatch } from "../../web3-interface/services/betting/get-match";
// import { getStoredFile } from "../../web3-interface/call-api/get-stored-file";

const Match = () => {
  const { query } = useRouter();
  const [data, setData] = useState<any>("");
  const id = query.matchId;
  let ignore = false;

  const getMatchDetails = async () => {
    // const res = await getStoredFile(`match-${id}`);
    // if (res.success) {
    //   console.log(res);
    //   setData(res);
    // } else {
    //   const response = await getMatch(id);
    //   console.log(response);
    //   setData(response);
    // }
    const response = await getMatch(id);
    console.log(response);
    setData(response);
  };

  useEffect(() => {
    if (!ignore && id) getMatchDetails();
    ignore = true; // eslint-disable-line
  }, [id]); // eslint-disable-line

  if (data && data.success)
    return (
      <div className={style.container}>
        <HeaderComponent />
        <div className={style.innerContainer}>
          <MatchDetails
            matchDetails={data?.data?.matchDetails}
            refresh={() => getMatchDetails()}
          />
          <div className={style.teamsContainer}>
            <div className={style.teamContainer}>
              <TeamDetails
                matchDetails={data?.data?.matchDetails}
                teamDetails={data?.data?.team1Details}
                team={1}
              />
            </div>
            <div className={style.teamContainer}>
              <TeamDetails
                matchDetails={data?.data?.matchDetails}
                teamDetails={data?.data?.team2Details}
                team={2}
              />
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

export default Match;

// ================================ getServerSideProps =============================

// export async function getServerSideProps(context: any) {
//   const matchId = context.query.matchId;
//   const path = `/tmp/match-${matchId}.json`;

//   try {
//     const exists = existsSync(path);
//     if (!exists) {
//       return { props: { success: false, data: [], message: "File not found" } };
//     }
//     // const rawFile = readFileSync(path, "utf-8");
//     // const file = JSON.parse(rawFile);
//     return {
//       props: { success: true, data: exists, message: "From stored data" },
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
