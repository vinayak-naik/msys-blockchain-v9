import { userWeb3Methods } from "../../helper/web3Methods";

export const getUserByAddress = async (address: string) => {
  try {
    const methods = await userWeb3Methods();
    const res = await methods.userList(address).call();
    const userObject = {
      userId: res.id,
      name: res.name,
      email: res.email,
      walletAddress: res.walletAddress,
      status: res.enabled ? "Active" : "Disabled",
    };
    return {
      success: true,
      data: userObject,
      message: "User exists",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to get user",
    };
  }
};
