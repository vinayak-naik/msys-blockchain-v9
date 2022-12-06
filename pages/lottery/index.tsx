import React, { useEffect, useState } from "react";
import style from "../../styles/pages/betting.module.css";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { getLotteries } from "../../web3-interface/services/lottery/get-lotteries";
import HeaderComponent from "../../components/header/header";
// import { getStoredFile } from "../../web3-interface/call-api/get-stored-file";

const MsysLotteries = () => {
  const [data, setData] = useState<any>("");
  let ignore = false;

  const getAllMatches = async () => {
    // const res = await getStoredFile("lotteries");
    // if (res.success) {
    //   console.log(res);
    //   setData(res);
    // } else {
    //   const response = await getLotteries();
    //   console.log(response);
    //   setData(response);
    // }
    const response = await getLotteries();
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
            <h1 className={style.header}>Lotteries</h1>
            <div className={style.gridContainer}>
              <div className={style.gridItem}>
                <div className={style.matchHeader}>Upcomming</div>
                <div className={style.cardMainContainer}>
                  <LotteryCards lotteries={data?.data?.upcomming} />
                </div>
              </div>
              <div className={style.gridItem}>
                <div className={style.matchHeader}>Active</div>
                <div className={style.cardMainContainer}>
                  <LotteryCards lotteries={data?.data?.active} />
                </div>
              </div>
              <div className={style.gridItem}>
                <div className={style.matchHeader}>Completed</div>
                <div className={style.cardMainContainer}>
                  <LotteryCards lotteries={data?.data?.completed} />
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

export default MsysLotteries;

// ================================ getServerSideProps =============================

// export async function getServerSideProps() {
//   const path = "/tmp/lotteries.json";

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

const LotteryCards = (props: any) => {
  const { lotteries } = props;
  const { push } = useRouter();
  return (
    <>
      {lotteries.map((item: any) => (
        <div
          key={item.lotteryId}
          className={style.cardContainer}
          onClick={() =>
            item.statusCode !== "1" ? push(`/lottery/${item.lotteryId}`) : null
          }
        >
          <div className={style.cardInnerContainer}>
            <div className={style.cardRow1}>
              <div className={style.cardText}>
                lotteryId:&nbsp;{item.lotteryId}
              </div>
              <div className={style.cardText}>time:&nbsp;{item.time}</div>
            </div>
            <div className={style.cardRow1}>
              <div className={style.cardText}>
                price:&nbsp;{item.price} MSCN
              </div>
              <div className={style.cardText}>date:&nbsp;{item.date}</div>
            </div>
            <div
              className={style.cardRow2}
              style={{ justifyContent: "center" }}
            >
              <div className={style.cardTeamName}>{item.lotteryName}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
