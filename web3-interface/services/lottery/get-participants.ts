import { lotteryWeb3Methods } from "../../helper/web3Methods";

export const getLotteryParticipants = async (
  lotteryId: number,
  totalParticipants: number,
  from: number,
  to: number
) => {
  try {
    const methods = await lotteryWeb3Methods();
    const participantsArr = [];
    for (let i = from; i < to; i++) {
      if (i < Number(totalParticipants)) {
        const address = await methods
          .getLotteryParticipant(lotteryId, i)
          .call()
          .catch((err: any) => console.log(err));

        participantsArr.push(address);
      }
    }

    return {
      success: true,
      data: participantsArr,
      message: "",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to get lottery participants",
    };
  }
};
