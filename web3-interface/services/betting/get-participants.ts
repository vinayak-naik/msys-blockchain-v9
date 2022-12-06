import { bettingWeb3Methods } from "../../helper/web3Methods";

export const getParticipants = async (
  lotteryId: number,
  team: number,
  totalParticipants: number,
  from: number,
  to: number
) => {
  try {
    const methods = await bettingWeb3Methods();
    const participantsArr = [];
    for (let i = from; i < to; i++) {
      if (i < Number(totalParticipants)) {
        const address = await methods
          .getParticipant(lotteryId, team, i)
          .call()
          .catch((err: any) => console.log(err));

        participantsArr.push(address);
      }
    }

    return participantsArr;
  } catch (error) {
    return false;
  }
};
