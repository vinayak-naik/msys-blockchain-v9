import { userWeb3Methods } from "../../helper/web3Methods";

export const getUserByEmail = async (email: string) => {
  try {
    const methods = await userWeb3Methods();
    const address = await methods.getUserByEmail(email).call();
    if (address === "0x0000000000000000000000000000000000000000") {
      return {
        success: false,
        data: address,
        message: "Address not found",
      };
    }
    return {
      success: true,
      data: address,
      message: "Address found",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to get wallet address",
    };
  }
};
