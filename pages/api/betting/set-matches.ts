import NextCors from "nextjs-cors";
import { writeFileSync } from "fs";
import { bettingWeb3Methods } from "../../../web3-interface/helper/web3Methods";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../../web3-interface/helper/conversion";

export default async function setMatches(req: any, res: any) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  try {
    const path = "/tmp/matches.json";
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

    const matches = { upcomming, active, completed };
    const stringifiedList = JSON.stringify(matches, null, 2);

    writeFileSync(path, stringifiedList);
    res.status(200).json({
      success: true,
      data: matches,
      message: "Matches stored successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed set data", error });
  }
}
