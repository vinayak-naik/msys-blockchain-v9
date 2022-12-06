import NextCors from "nextjs-cors";
import { writeFileSync } from "fs";
import { bettingWeb3Methods } from "../../../../web3-interface/helper/web3Methods";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "../../../../web3-interface/helper/conversion";

export default async function setMatch(req: any, res: any) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  try {
    const { matchId } = req.query;
    const path = `/tmp/match-${matchId}.json`;
    const methods = await bettingWeb3Methods();
    let match: any;
    await methods
      .matches(matchId)
      .call()
      .then((data: any) => (match = data))
      .catch(() => (match = undefined));

    if (!match) {
      res.status(400).json({ success: false, message: "Match not found" });
      return;
    }
    const team1 = await methods.getAllParticipants(matchId, 1).call();
    const team2 = await methods.getAllParticipants(matchId, 2).call();

    const date = convertTimestampToDate(match.timestamp);
    const time = convertTimestampToTime(match.timestamp);

    const team1Length = team1.length;
    const team2Length = team2.length;

    let team1TotalAmount: number = 0;
    let team2TotalAmount: number = 0;
    team1.forEach((item: any) => {
      team1TotalAmount += Number(item[2]);
    });
    team2.forEach((item: any) => {
      team2TotalAmount += Number(item[2]);
    });

    const team1ParticipantsPercent = (
      (team1Length * 100) /
      (team1Length + team2Length)
    ).toFixed(2);
    const team2ParticipantsPercent = (
      (team2Length * 100) /
      (team1Length + team2Length)
    ).toFixed(2);

    const team1AmountPercent = (
      (team1TotalAmount * 100) /
      (team1TotalAmount + team2TotalAmount)
    ).toFixed(2);
    const team2AmountPercent = (
      (team2TotalAmount * 100) /
      (team1TotalAmount + team2TotalAmount)
    ).toFixed(2);

    const statusString =
      match.statusCode === "2"
        ? "Active"
        : match.statusCode === "3"
        ? "Completed"
        : "Upcomming";

    const details = {
      matchId: Number(match.matchId),
      matchDetails: {
        matchId: Number(match.matchId),
        team1: match.team1,
        team2: match.team2,
        game: match.game,
        date: date,
        time: time,
        won: Number(match.won),
        statusCode: Number(match.statusCode),
        statusString: statusString,
        totalParticipants: team1.length + team2.length,
        totalAmount: team1TotalAmount + team2TotalAmount,
      },
      team1Details: {
        length: team1.length,
        totalAmount: team1TotalAmount,
        participantsPercent:
          Number(team1ParticipantsPercent) > 0
            ? Number(team1ParticipantsPercent)
            : 0,
        amountPercent:
          Number(team1AmountPercent) > 0 ? Number(team1AmountPercent) : 0,
      },
      team2Details: {
        length: team2.length,
        totalAmount: team2TotalAmount,
        participantsPercent:
          Number(team2ParticipantsPercent) > 0
            ? Number(team2ParticipantsPercent)
            : 0,
        amountPercent:
          Number(team2AmountPercent) > 0 ? Number(team2AmountPercent) : 0,
      },
    };
    const stringifiedList = JSON.stringify(details, null, 2);

    writeFileSync(path, stringifiedList);
    res.status(200).json({
      success: true,
      data: details,
      message: "Match stored successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed set data", error });
  }
}
