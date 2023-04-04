import { Close, ContentCopyRounded } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import HeaderComponent from "../components/header/header";
import { RootState } from "../redux/store";
import style from "../styles/pages/participate.module.css";
import { compressAddress } from "../web3-interface/helper/conversion";
import { getMaticBalance } from "../web3-interface/services/user/get-matic-balance";
import { getTokenBalance } from "../web3-interface/services/user/get-token-balance";
import { getUserByEmail } from "../web3-interface/services/user/get-user-by-email";

const Participate = () => {
  const [session]: any = useSession();
  const { query, back } = useRouter();
  const { bettingContract, lotteryContract, signer } = useSelector(
    (state: RootState) => state.contract
  );
  const [inputError, setInputError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [maticBalance, setMaticBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<any>("");
  const [transactionResponse, setTransactionResponse] = useState<any>({});
  const [error, setError] = useState("");

  const getTokenBalanceHandler = async () => {
    const res = await getTokenBalance(walletAddress);
    if (!res.success) return;
    setTokenBalance(res.data);
  };
  const getMaticBalanceHandler = async () => {
    const balance = await getMaticBalance(walletAddress);
    if (!balance) return;
    setMaticBalance(balance);
  };

  const copyAddressHandler = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopyText("Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 4000);
  };

  const getWalletAddress = async (email: string) => {
    const res = await getUserByEmail(email);
    if (!res.success) return;
    setWalletAddress(res.data);
  };
  useEffect(() => {
    if (session) getWalletAddress(session?.user?.email);
  }, [session]); // eslint-disable-line

  useEffect(() => {
    if (walletAddress) {
      getTokenBalanceHandler();
      getMaticBalanceHandler();
    }
  }, [walletAddress]); // eslint-disable-line

  const checkCondition = () => {
    const minMaticBalance = Web3.utils.fromWei("300000", "ether");
    if (query.type !== "1" && query.type !== "2") {
      setError("Invalid type input");
      return false;
    }
    if (query.id === undefined) {
      setError("Invalid game id");
      return false;
    }
    if (query.id === undefined) {
      setError("Invalid game id");
      return false;
    }
    if (Number(maticBalance) < Number(minMaticBalance)) {
      setError(
        `Insufficient wallet balance, You have only ${maticBalance} MSCN`
      );
      return false;
    }

    // ==============================================
    if (query.type === "1") {
      if (query.team !== "1" && query.team !== "2") {
        setError("Invalid input");
        return false;
      }
      if (amount < 1) {
        setInputError("Minimum amount is 1 MSCN");
        return false;
      }
      if (amount > 1000) {
        setInputError("Maximum amount is 1000 MSCN");
        return false;
      }
      if (amount > Number(tokenBalance)) {
        setInputError(
          `Insufficient wallet balance, You have only ${tokenBalance} MSCN`
        );
        return false;
      }
    }

    setInputError("");
    setError("");
    return true;
  };

  const participate = async () => {
    if (loading) return;
    const result = checkCondition();
    if (!result) return;
    setLoading(true);
    try {
      let data;
      if (query.type === "1") {
        const res = await bettingContract
          .connect(signer)
          .participate(Number(query.id), Number(query.team), amount);
        data = await res.wait();
      } else {
        const res = await lotteryContract
          .connect(signer)
          .participateLottery(Number(query.id));
        data = await res.wait();
      }
      getTokenBalanceHandler();
      getMaticBalanceHandler();

      const transactionObj = {
        blockHash: data.blockHash,
        blockNumber: data.blockNumber,
        gasUsed: Number(data.gasUsed),
        cumulativeGasUsed: Number(data.cumulativeGasUsed),
        effectiveGasPrice: Number(data.effectiveGasPrice),
        transactionHash: data.transactionHash,
        transactionIndex: data.transactionIndex,
        type: data.type,
        from: data.from,
        to: data.to,
        status: data.status,
      };
      setTransactionResponse(transactionObj);
      setLoading(false);
    } catch (error) {
      setError("Metamask Error");
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderComponent />
      <div className={style.container}>
        <div className={style.innerContainer}>
          <div className={style.leftBox}>
            <div className={style.textContainer}>
              <h1>
                Participate <span>for</span> {query.name}
              </h1>
              <div className={style.textBox}>
                <div className={style.textHead}>Name:</div>
                <div className={style.text}>{session?.user?.name}</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>Email:</div>
                <div className={style.text}>{session?.user?.email}</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>MSCN Balance:</div>
                <div className={style.text}>{tokenBalance} MSCN</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>MATIC Balance:</div>
                <div className={style.text}>
                  {Number(maticBalance).toFixed(5)} MATIC
                </div>
              </div>

              <div className={style.textBox}>
                <div className={style.textHead}>Wallet Address:</div>
                <div className={style.text}>
                  {compressAddress(walletAddress)}
                  <Tooltip title={copyText} placement="top">
                    <IconButton
                      onClick={copyAddressHandler}
                      sx={{
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                    >
                      <ContentCopyRounded
                        sx={{
                          fontSize: 14,
                          color: "white",
                          marginBottom: "4px",
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {query.price && (
                <div className={style.textBox}>
                  <div className={style.textHead}>Lottery Amount:</div>
                  <div className={style.text}>{query.price} MATIC</div>
                </div>
              )}

              {error && <div className={style.errorMessage}>{error}</div>}
              {query.type === "1" && (
                <div className={style.inputContainer}>
                  <div className={style.inputLabel}>Enter bet amount</div>
                  <input
                    type="number"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    value={amount}
                  />
                  {inputError && (
                    <div className={style.errorMessage}>{inputError}</div>
                  )}
                </div>
              )}
              <div className={style.buttonContainer}>
                <Button
                  variant="contained"
                  onClick={participate}
                  endIcon={
                    loading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : null
                  }
                >
                  {loading ? "Processing..." : `Participate for ${query.name}`}
                </Button>

                {transactionResponse.transactionHash && (
                  <Button variant="contained">
                    <a
                      target="blank"
                      href={`https://mumbai.polygonscan.com/tx/${transactionResponse.transactionHash}`}
                    >
                      View Transaction on Polygonscan
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className={style.rightBox}>
            <div className={style.textContainer}>
              <h1>Trasaction Details</h1>
              <div className={style.textBox}>
                <div className={style.textHead}>BlockHash:</div>
                <div className={style.text}>
                  {transactionResponse.blockHash}
                </div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>BlockNumber:</div>
                <div className={style.text}>
                  {transactionResponse.blockNumber}
                </div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>GasUsed:</div>
                <div className={style.text}>{transactionResponse.gasUsed}</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>CumulativeGasUsed:</div>
                <div className={style.text}>
                  {transactionResponse.cumulativeGasUsed}
                </div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>EffectiveGasPrice:</div>
                <div className={style.text}>
                  {transactionResponse.effectiveGasPrice}
                </div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>TransactionHash:</div>
                <div
                  onClick={() =>
                    navigator.clipboard.writeText(
                      transactionResponse.transactionHash || ""
                    )
                  }
                  className={`${style.text} ${style.transactionHash}`}
                >
                  {transactionResponse.transactionHash}
                </div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>TransactionIndex:</div>
                <div className={style.text}>
                  {transactionResponse.transactionIndex}
                </div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>Type:</div>
                <div className={style.text}>{transactionResponse.type}</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>From:</div>
                <div className={style.text}>{transactionResponse.from}</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>To:</div>
                <div className={style.text}>{transactionResponse.to}</div>
              </div>
              <div className={style.textBox}>
                <div className={style.textHead}>Status:</div>
                <div className={style.text}>
                  {transactionResponse.transactionHash
                    ? transactionResponse.status
                      ? "true"
                      : "false"
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div onClick={back} className={style.cancelButtonContainer}>
            <Close />
          </div>
        </div>
      </div>
    </>
  );
};

export default Participate;
