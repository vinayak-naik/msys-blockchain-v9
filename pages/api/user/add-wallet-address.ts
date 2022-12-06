import NextCors from "nextjs-cors";
import Web3 from "web3";
import userABI from "../../../web3-interface/ABI/user.abi.json";
import jwt from "jsonwebtoken";

const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_URL || "";
const USER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_USER_CONTRACT_ADDRESS || "";
const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY || "";
const MY_SECRETE = process.env.MY_SECRETE || "";
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS || "";

export default async function setMatches(req: any, res: any) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  try {
    const { walletAddress, token } = req.body;
    const jwtData: any = jwt.verify(token, MY_SECRETE);
    if (!jwtData.email) {
      res.status(400).json({ success: false, message: "Invalid token" });
      return;
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
    const myContract = new web3.eth.Contract(
      // @ts-ignore
      userABI,
      USER_CONTRACT_ADDRESS
    );

    let error;
    const result = await myContract.methods
      .getUserByEmail(jwtData.email)
      .call()
      .catch((err: any) => {
        error = err;
      });
    if (error) {
      res.status(404).json({
        success: false,
        message: "Failed to add wallet address",
        error: `${error}`,
      });
    }
    if (result !== "0x0000000000000000000000000000000000000000") {
      res
        .status(400)
        .json({ success: false, message: "Wallet address already added" });
      return;
    }

    //Attaching admin privateKey
    const account = web3.eth.accounts.privateKeyToAccount(
      "0x" + MY_PRIVATE_KEY
    );
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    // --------------------------

    await myContract.methods
      .addUser(walletAddress, jwtData.name, jwtData.email)
      .send({ from: ADMIN_WALLET_ADDRESS, gas: 922374 })
      .catch((err: any) => {
        error = err;
      });
    if (error) {
      res.status(404).json({
        success: false,
        message: "Failed to add wallet address",
        error: `${error}`,
      });
    }

    res.status(200).json({
      success: true,
      data: { walletAddress, name: jwtData.name, email: jwtData.email },
      message: "Wallet address added successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to add wallet address", error });
  }
}
