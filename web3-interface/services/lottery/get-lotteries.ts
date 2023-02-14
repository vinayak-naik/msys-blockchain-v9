import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../helper/conversion";
import { lotteryWeb3Methods } from "../../helper/web3Methods";

export const getLotteries = async () => {
  try {
    console.log("getAllLotteries  running");
    const methods = await lotteryWeb3Methods();
    const result = await methods
      .getAllLotteries()
      .call()
      .catch((err: any) => console.log(err));

    console.log("getAllLotteries======", result);

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

    return {
      success: true,
      data: { upcomming, active, completed },
      message: "From blockchain",
    };
  } catch (error) {
    return { success: false, data: null, message: "Failed to get lotteries" };
  }
};
