import { lotteryWeb3Methods } from "../../helper/web3Methods";

export const getLotteryWinners = async (lotteryId: any) => {
  try {
    const methods = await lotteryWeb3Methods();
    const winners = await methods.lotteryWinners(lotteryId).call();

    return {
      success: true,
      data: [winners.first, winners.second, winners.third],
      message: "",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to get lottery winners",
    };
  }
};
