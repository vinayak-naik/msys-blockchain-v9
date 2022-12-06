import Web3 from "web3";
const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_URL || "";

export const getMaticBalance = async (address: any) => {
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
    const res = await web3.eth.getBalance(address);

    const balance = Web3.utils.fromWei(res, "ether");

    return balance;
  } catch (error) {
    return false;
  }
};
