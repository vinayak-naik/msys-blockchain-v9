import NextCors from "nextjs-cors";
import { writeFileSync } from "fs";
import { lotteryWeb3Methods } from "../../../../web3-interface/helper/web3Methods";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../../../web3-interface/helper/conversion";

export default async function setLottery(req: any, res: any) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  try {
    const { lotteryId } = req.query;
    const path = `/tmp/lottery-${lotteryId}.json`;
    const methods = await lotteryWeb3Methods();
    let lottery: any;
    await methods
      .lotteries(lotteryId)
      .call()
      .then((data: any) => (lottery = data))
      .catch(() => (lottery = undefined));

    if (!lottery) {
      res.status(400).json({ success: false, message: "Lottery not found" });
      return;
    }

    const _length = await methods
      .getLotteryParticipantsLength(lotteryId)
      .call();
    const amount = Number(lottery.amount);
    const length = Number(_length);

    const totalAmount = (amount * 0.99 * length).toFixed(2);
    const totalFees = (amount * 0.01 * length).toFixed(2);

    const date = convertTimestampToDate(lottery.timestamp);
    const time = convertTimestampToTime(lottery.timestamp);

    const statusString =
      lottery.statusCode === "2"
        ? "Active"
        : lottery.statusCode === "3"
        ? "Completed"
        : "Upcomming";

    const details = {
      lotteryId: Number(lottery.lotteryId),
      lotteryName: lottery.lotteryName,
      statusCode: Number(lottery.statusCode),
      amount,
      date,
      time,
      statusString,
      length,
      totalAmount,
      totalFees,
    };
    const stringifiedList = JSON.stringify(details, null, 2);

    writeFileSync(path, stringifiedList);
    res.status(200).json({
      success: true,
      data: details,
      message: "Lottery stored successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed set data", error });
  }
}
