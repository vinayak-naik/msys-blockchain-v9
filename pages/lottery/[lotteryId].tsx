import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LotteryDetails from "../../components/atoms/lotteryDetails";
import { LotteryWinnersDialog } from "../../components/dialogs/lotteryWinnersDialog";
import HeaderComponent from "../../components/header/header";
import LotteryParticipants from "../../components/tables/lottery-participants";
import style from "../../styles/pages/lotteryDetails.module.css";
import { getLottery } from "../../web3-interface/services/lottery/get-lottery";
// import { getStoredFile } from "../../web3-interface/call-api/get-stored-file";

const Lottery = () => {
  const [data, setData] = useState<any>("");
  const [openWinners, setOpenWinners] = useState(false);
  const { query } = useRouter();
  const id = query.lotteryId;
  let ignore = false;

  const getLotteryDetails = async () => {
    // const res = await getStoredFile(`lottery-${id}`);
    // if (res.success) {
    //   console.log(res);
    //   setData(res);
    // } else {
    //   const response = await getLottery(id);
    //   console.log(response);
    //   setData(response);
    // }

    const response = await getLottery(id);
    console.log(response);
    setData(response);
  };

  useEffect(() => {
    if (!ignore && id) getLotteryDetails();
    ignore = true; // eslint-disable-line
  }, [id]); // eslint-disable-line

  if (data && data.success)
    return (
      <>
        <div className={style.container}>
          <HeaderComponent />
          <div className={style.innerContainer}>
            <LotteryDetails
              openDialog={() => setOpenWinners(true)}
              data={data.data}
              refresh={getLotteryDetails}
              id={query.lotteryId}
            />
            <LotteryParticipants lotteryDetails={data.data} />
          </div>
        </div>
        <LotteryWinnersDialog
          openWinners={openWinners}
          handleClose={() => setOpenWinners(false)}
          id={query.lotteryId}
          lotteryDetails={data.data}
        />
      </>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default Lottery;

// ================================ getServerSideProps =============================

// export async function getServerSideProps(context: any) {
//   const lotteryId = context.query.lotteryId;
//   const path = `/tmp/lottery-${lotteryId}.json`;

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
