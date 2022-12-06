import { lotteryWeb3Methods } from "../../helper/web3Methods";

export const getLotteryParticipantsLength = async (lotteryId: any) => {
  try {
    const methods = await lotteryWeb3Methods();
    const length = await methods
      .getLotteryParticipantsLength(lotteryId)
      .call()
      .catch((err: any) => console.log(err));
    return {
      success: true,
      data: length,
      message: "",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to get lottery participants length",
    };
  }
};
