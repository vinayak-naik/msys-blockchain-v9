import { ContentCopyRounded } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { ethers } from "ethers";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import RecordsTable from "../components/tables/user-records";
import style from "../styles/pages/userProfile.module.css";
import { addWalletAddressApiCall } from "../web3-interface/call-api/user/add-wallet-address";
import { compressAddress } from "../web3-interface/helper/conversion";
import { getUserByEmail } from "../web3-interface/services/user/get-user-by-email";
import { getTokenBalance } from "../web3-interface/services/user/get-token-balance";
import { getMaticBalance } from "../web3-interface/services/user/get-matic-balance";
import HeaderComponent from "../components/header/header";
import { useRouter } from "next/router";

const UserProfile = () => {
  const [session]: any = useSession();
  const { push } = useRouter();
  const [inputAddress, setInputAddress] = useState("");
  const [inputError, setInputError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [maticBalance, setMaticBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [loading, setLoading] = useState(false);

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

  const addWalletHandler = async () => {
    if (!session) return;
    if (walletAddress) return;
    if (!inputAddress) return;
    if (!ethers.utils.isAddress(inputAddress)) {
      setInputError("Invalid Wallet address");
    } else {
      setInputError("");
    }
    setLoading(true);
    await addWalletAddressApiCall({
      walletAddress: inputAddress,
      token: session.token,
    });
    getWalletAddress(session?.user?.email);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (session) getWalletAddress(session?.user?.email);
  }, [session]); // eslint-disable-line

  return (
    <div className={style.container}>
      <HeaderComponent />
      <div className={style.containerLayer}>
        <div className={style.leftBox}>
          <div className={style.imageContainer}>
            <div className={style.imageBox}>
              {session?.user?.image && (
                <Image
                  alt="img"
                  loader={({ src }: any) => src}
                  src={session?.user?.image}
                  height="200px"
                  width="200px"
                  style={{ borderRadius: "50%" }}
                />
              )}
            </div>
          </div>
          <div className={style.detailsContainer}>
            <div className={style.userDetails}>
              <div className={style.userName}>{session?.user?.name}</div>
              <div className={style.userEmail}>{session?.user?.email}</div>
              {walletAddress && (
                <div className={style.userWalletAddress}>
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
              )}
            </div>
            <div className={style.accountDetails}>
              {!walletAddress ? (
                <div className={style.buttonBox}>
                  <div className={style.inputContainer}>
                    <input
                      type="text"
                      onChange={(e) => setInputAddress(e.target.value)}
                      value={inputAddress}
                    />
                    {inputError && (
                      <div className={style.errorMessage}>{inputError}</div>
                    )}
                    <Button variant="outlined" onClick={addWalletHandler}>
                      {loading ? "Processing" : "Add Wallet Address"}
                    </Button>
                    <div
                      onClick={() => push("/guide")}
                      className={style.howToAdd}
                    >
                      How to add Wallet Address?
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={style.buttonBox}>
                    {maticBalance && (
                      <div className={style.balance}>{maticBalance} MATIC</div>
                    )}
                    <Button onClick={getMaticBalanceHandler} variant="outlined">
                      Get Matic balance
                    </Button>
                  </div>
                  <div className={style.buttonBox}>
                    {tokenBalance && (
                      <div className={style.balance}>{tokenBalance} MSCN</div>
                    )}
                    <Button onClick={getTokenBalanceHandler} variant="outlined">
                      Get MSCN balance
                    </Button>
                  </div>
                </>
              )}
              <div className={style.signOutButtonBox}>
                <Button onClick={() => signOut()} variant="outlined">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={style.rightBox}>
          <RecordsTable walletAddress={walletAddress} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
