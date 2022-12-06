import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../helper/conversion";
import { bettingWeb3Methods } from "../../helper/web3Methods";

export const getMatches = async () => {
  try {
    const methods = await bettingWeb3Methods();
    const result = await methods
      .getAllMatches()
      .call()
      .catch((err: any) => console.log(err));

    let upcomming: any = [];
    let active: any = [];
    let completed: any = [];
    result.forEach((item: any) => {
      const match = {
        date: convertTimestampToDate(Number(item.timestamp)),
        time: convertTimestampToTime(Number(item.timestamp)),
        matchId: item.matchId,
        game: item.game,
        team1: item.team1,
        team2: item.team2,
        statusCode: item.statusCode,
      };
      if (item.statusCode === "1") upcomming.push(match);
      if (item.statusCode === "2") active.push(match);
      if (item.statusCode === "3") completed.push(match);
    });

    return {
      success: true,
      data: { upcomming, active, completed },
      message: "From blockchain",
    };
  } catch (error) {
    return { success: false, data: null, message: "Failed to get matches" };
  }
};
