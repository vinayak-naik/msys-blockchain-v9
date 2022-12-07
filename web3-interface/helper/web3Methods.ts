import Web3 from "web3";
import userABI from "../ABI/user.abi.json";
import bettingABI from "../ABI/betting.abi.json";
import lotteryABI from "../ABI/lottery.abi.json";
import nftABI from "../ABI/nft.abi.json";
import gameABI from "../ABI/game.abi.json";

const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_URL || "";
const USER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_USER_CONTRACT_ADDRESS || "";
const BETTING_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS || "";
const LOTTERY_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS || "";

// ========================== Web3 Provider =================================

export const web3Provider = async () => {
  return new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
};

// ========================== User =================================

export const userWeb3Methods = async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
  const myContract = new web3.eth.Contract(
    // @ts-ignore
    userABI,
    USER_CONTRACT_ADDRESS
  );
  return myContract.methods;
};

// ========================== Betting =================================

export const bettingWeb3Methods = async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
  const myContract = new web3.eth.Contract(
    // @ts-ignore
    bettingABI,
    BETTING_CONTRACT_ADDRESS
  );
  return myContract.methods;
};

// ========================== Lottery =================================

export const lotteryWeb3Methods = async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
  const myContract = new web3.eth.Contract(
    // @ts-ignore
    lotteryABI,
    LOTTERY_CONTRACT_ADDRESS
  );
  return myContract.methods;
};

// ========================== NFT =================================

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "";

export const nftWeb3Methods = async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
  const myContract = new web3.eth.Contract(
    // @ts-ignore
    nftABI,
    NFT_CONTRACT_ADDRESS
  );
  return myContract.methods;
};
// ========================== Game =================================

const GAME_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS || "";

export const gameWeb3Methods = async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));
  const myContract = new web3.eth.Contract(
    // @ts-ignore
    gameABI,
    GAME_CONTRACT_ADDRESS
  );
  return myContract.methods;
};
