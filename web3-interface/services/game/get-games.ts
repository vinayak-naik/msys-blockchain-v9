import { gameWeb3Methods } from "../../helper/web3Methods";

export const getGames = async () => {
  try {
    const methods = await gameWeb3Methods();
    const result = await methods
      .getAllGames()
      .call()
      .catch((err: any) => console.log(err));

    const gamesList = result.map((item: any) => {
      return {
        gameId: Number(item.id),
        name: item.name,
        route: item.route,
        internalUrl: item.internalUrl,
        externalUrl: item.externalUrl,
        active: item.active,
        visibility: item.visibility,
      };
    });

    return {
      success: true,
      data: gamesList,
      message: "From blockchain",
    };
  } catch (error) {
    return { success: false, data: null, message: "Failed to get games" };
  }
};
