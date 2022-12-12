import React, { useEffect, useState } from "react";
import style from "./header.module.css";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useRouter } from "next/router";
import Image from "next/image";
import { signIn, useSession } from "next-auth/client";
import Link from "next/link";
import logo from "../../public/static/img/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ethers } from "ethers";
import userABI from "../../web3-interface/ABI/user.abi.json";
import bettingABI from "../../web3-interface/ABI/betting.abi.json";
import lotteryABI from "../../web3-interface/ABI/lottery.abi.json";
import nftABI from "../../web3-interface/ABI/nft.abi.json";
import {
  setBettingContract,
  setLotteryContract,
  setNftContract,
  setSigner,
  setUserContract,
} from "../../redux/redux-toolkit/contractSlice";

declare var window: any;

const HeaderComponent = () => {
  const [session]: any = useSession();
  const dispatch = useDispatch();
  const { signer } = useSelector((state: RootState) => state.contract);
  const [showDrawer, setShowDrawer] = useState(false);

  // console.log(session);

  const USER_CONTRACT_ADDRESS =
    `${process.env.NEXT_PUBLIC_USER_CONTRACT_ADDRESS}` || "";
  const BETTING_CONTRACT_ADDRESS =
    `${process.env.NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS}` || "";
  const LOTTERY_CONTRACT_ADDRESS =
    `${process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS}` || "";
  const NFT_CONTRACT_ADDRESS =
    `${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}` || "";

  const setSign = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const sign = provider.getSigner();
      dispatch(setSigner(sign));
      const userContract = new ethers.Contract(
        USER_CONTRACT_ADDRESS,
        userABI,
        provider
      );
      const bettingContract = new ethers.Contract(
        BETTING_CONTRACT_ADDRESS,
        bettingABI,
        provider
      );
      const lotteryContract = new ethers.Contract(
        LOTTERY_CONTRACT_ADDRESS,
        lotteryABI,
        provider
      );
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        nftABI,
        provider
      );

      dispatch(setUserContract(userContract));
      dispatch(setBettingContract(bettingContract));
      dispatch(setLotteryContract(lotteryContract));
      dispatch(setNftContract(nftContract));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSign();
  }, []); //eslint-disable-line

  useEffect(() => {
    if (signer) {
      connectMeta();
    }
  }, [signer]); //eslint-disable-line

  const connectMeta = async () => {
    try {
      await signer.getAddress();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.headerContainer}>
      <div className={style.leftBox}>
        {/* <BackButton /> */}
        {!showDrawer && <AppName />}
      </div>
      <div className={style.rightBox}>
        <Navigation />
        {session ? <UserImage /> : <SignInButton />}
      </div>
      <HambergerMenu setShowDrawer={() => setShowDrawer(!showDrawer)} />
      <Drawer
        showDrawer={showDrawer}
        setShowDrawer={() => setShowDrawer(!showDrawer)}
      />
    </div>
  );
};

export default HeaderComponent;

// const BackButton = () => {
//   const { back } = useRouter();
//   const sx = { color: "rgb(182, 185, 196)" };
//   return (
//     <IconButton onClick={() => back()}>
//       <ArrowBackOutlined sx={sx} />
//     </IconButton>
//   );
// };

const AppName = () => {
  const { push } = useRouter();
  return (
    <div onClick={() => push("/")} className={style.appNameBox}>
      <Image src={logo} alt="image" height="35" width="35" />
      <div className={style.appName}>MSys Blockchain Platform</div>
    </div>
  );
};
const Navigation = () => {
  return (
    <div className={style.navBox}>
      <Link href="/">
        <div className={style.navItem}>Home</div>
      </Link>
      <Link href="/games">
        <div className={style.navItem}>Games</div>
      </Link>
      <Link href="/articles">
        <div className={style.navItem}>Articles</div>
      </Link>
      <Link href="/guide">
        <div className={style.navItem}>Guide</div>
      </Link>
      <Link href="/about">
        <div className={style.navItem}>About Us</div>
      </Link>
    </div>
  );
};
const SignInButton = () => {
  return (
    <div className={style.authBox}>
      <div onClick={() => signIn("google")} className={style.signInButton}>
        Sign In
      </div>
    </div>
  );
};
const HambergerMenu = ({ setShowDrawer }: any) => {
  return (
    <div className={style.hambergerMenu}>
      <IconButton
        onClick={setShowDrawer}
        sx={{ color: "white", marginRight: "10px" }}
        aria-label="delete"
      >
        <Menu fontSize="large" />
      </IconButton>
    </div>
  );
};
const UserImage = () => {
  const [session]: any = useSession();
  const [userImage, setUserImage] = useState(
    "https://png.pngtree.com/png-clipart/20190516/original/pngtree-users-vector-icon-png-image_3725294.jpg"
  );
  useEffect(() => {
    if (session?.user.image) setUserImage(session.user.image);
  }, [session]);
  const { push } = useRouter();
  let host = "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_APP_URL || "";
  }
  const redirect = () => {
    window.location.href === `${host}/user`
      ? console.log("called again")
      : push("/user");
  };
  return (
    <div className={style.userImageBox} onClick={redirect}>
      <Image
        alt="img"
        loader={({ src }: any) => src}
        src={userImage}
        height="35px"
        width="35px"
        style={{ borderRadius: "50%" }}
      />
    </div>
  );
};
const Drawer = (props: any) => {
  const [session]: any = useSession();
  const { showDrawer, setShowDrawer } = props;
  return (
    <div
      className={`${style.drawerContainer} ${
        showDrawer && style.drawerContainerActive
      }`}
      onClick={setShowDrawer}
    >
      <div className={`${style.drawer} ${showDrawer && style.drawerActive}`}>
        {showDrawer && (
          <>
            <div className={style.sideNavLogo}>
              <div>MSys</div>
              <div>Blockchain</div>
              <div>Platform</div>
            </div>
            <div className={style.sideNavContainer}>
              {session ? (
                <Link href="/user">
                  <div className={style.sideNavItem}>Profile</div>
                </Link>
              ) : (
                <div
                  className={style.sideNavItem}
                  onClick={() => signIn("google")}
                  style={{ color: "#ebbaff" }}
                >
                  Sign in
                </div>
              )}

              <Link href="/">
                <div className={style.sideNavItem}>Home</div>
              </Link>

              <Link href="/games">
                <div className={style.sideNavItem}>Games</div>
              </Link>
              <Link href="/articles">
                <div className={style.sideNavItem}>Articles</div>
              </Link>
              <Link href="/guide">
                <div className={style.sideNavItem}>Guide</div>
              </Link>
              <Link href="/about">
                <div className={style.sideNavItem}>About Us</div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
