import { userWeb3Methods } from "../../helper/web3Methods";

export const getTokenBalance = async (address: string) => {
  try {
    const methods = await userWeb3Methods();
    const balance = await methods.balanceOf(address).call();
    return {
      success: true,
      data: balance,
      message: "",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to get wallet balance",
    };
  }
};
