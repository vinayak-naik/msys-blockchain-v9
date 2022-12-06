import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../helper/conversion";
import { lotteryWeb3Methods } from "../../helper/web3Methods";

export const getLottery = async (lotteryId: any) => {
  try {
    const methods = await lotteryWeb3Methods();
    let lottery: any;
    await methods
      .lotteries(lotteryId)
      .call()
      .then((data: any) => (lottery = data))
      .catch(() => (lottery = undefined));

    if (!lottery) {
      return { success: false, data: null, message: "Lottery not found" };
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

    return {
      success: true,
      data: details,
      message: "From blockchain",
    };
  } catch (error) {
    return { success: false, data: null, message: "Failed to get lottery" };
  }
};
