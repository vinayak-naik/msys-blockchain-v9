import NextCors from "nextjs-cors";
import { writeFileSync } from "fs";
import { lotteryWeb3Methods } from "../../../web3-interface/helper/web3Methods";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../../web3-interface/helper/conversion";

export default async function setLotteries(req: any, res: any) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  try {
    const path = "/tmp/lotteries.json";
    const methods = await lotteryWeb3Methods();
    const result = await methods
      .getAllLotteries()
      .call()
      .catch((err: any) => console.log(err));

    let upcomming: any = [];
    let active: any = [];
    let completed: any = [];
    result.forEach((item: any) => {
      const lottery = {
        date: convertTimestampToDate(Number(item.timestamp)),
        time: convertTimestampToTime(Number(item.timestamp)),
        lotteryId: item.lotteryId,
        lotteryName: item.lotteryName,
        statusCode: item.statusCode,
        price: item.amount,
      };
      if (item.statusCode === "1") upcomming.push(lottery);
      if (item.statusCode === "2") active.push(lottery);
      if (item.statusCode === "3") completed.push(lottery);
    });

    const lotteries = { upcomming, active, completed };
    const stringifiedList = JSON.stringify(lotteries, null, 2);

    writeFileSync(path, stringifiedList);
    res.status(200).json({
      success: true,
      data: lotteries,
      message: "Lotteries stored successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed set data", error });
  }
}
