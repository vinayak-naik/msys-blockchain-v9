import { bettingWeb3Methods } from "../../helper/web3Methods";

export const getParticipantsLength = async (
  lotteryId: number,
  team: number
) => {
  try {
    const methods = await bettingWeb3Methods();
    const length = await methods
      .getParticipantsLength(lotteryId, team)
      .call()
      .catch((err: any) => console.log(err));
    return length;
  } catch (error) {
    return false;
  }
};
