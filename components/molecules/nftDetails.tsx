import { AccountCircle, Launch } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/client";
import Image from "next/image";
import React, { useState } from "react";
import style from "../../styles/pages/nftDetails.module.css";
import opensea from "../../public/static/img/opensea.png";
import { useRouter } from "next/router";
import {
  approveToken,
  buyNft,
  updateNftForSale,
} from "../../web3-interface/call-api/nft";
import { compressAddress } from "../../web3-interface/helper/conversion";

// ================================ NftImage ====================================
export const NftImage = ({ link }: any) => {
  return (
    <div className={style.imageContainer}>
      {link && (
        <Image
          alt="img"
          width="500px"
          height="500px"
          loader={({ src }: any) => src}
          src={link}
          style={{ borderRadius: "10px" }}
        />
      )}
    </div>
  );
};
// ================================ NftDescription ====================================
export const NftDescription = ({ description }: any) => {
  return (
    <div className={style.nftDescription}>
      <div className={style.nftDescriptionHead}>Description</div>
      <div className={style.nftDescriptionBody}>{description}</div>
    </div>
  );
};
// ================================ NftProperties ====================================
export const NftProperties = ({ properties }: any) => {
  return (
    <div className={style.nftProperties}>
      <div className={style.nftPropertiesHead}>Properties</div>
      <div className={style.nftPropertiesBody}>
        {properties &&
          properties.map((item: any, index: number) => (
            <div key={index} className={style.nftPropertyBox}>
              <div className={style.trait}>{item.trait_type}</div>
              <div className={style.value}>{item.value}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
// ================================ OwnerContainer ====================================
export const OwnerContainer = (props: any) => {
  const { creator, currentOwner } = props;
  return (
    <div className={style.ownerContainer}>
      <div className={style.ownerWrap}>
        <div className={style.avatarBox}>
          <AccountCircle color="warning" sx={{ fontSize: "42px" }} />
        </div>
        <div className={style.owner}>
          <div className={style.ownerHead}>Creator</div>
          <div className={style.ownerBody}>{creator}</div>
        </div>
      </div>
      <div className={style.ownerWrap}>
        <div className={style.avatarBox}>
          <AccountCircle color="success" sx={{ fontSize: "42px" }} />
        </div>
        <div className={style.owner}>
          <div className={style.ownerHead}>Current Owner</div>
          <div className={style.ownerBody}>{currentOwner}</div>
        </div>
      </div>
    </div>
  );
};

// ================================ OpenseaLink ====================================
export const OpenseaLink = () => {
  const { query } = useRouter();
  const id = query.tokenId;
  return (
    <div className={style.openseaContainer} style={{ opacity: "0.8" }}>
      {/* <div className={style.openseaText}>Sell NFT</div> */}
      <a
        target="blank2"
        href={`https://testnets.opensea.io/assets/mumbai/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}/${id}`}
        className={style.imageBox}
      >
        <Image
          alt="img"
          loader={({ src }: any) => src}
          src={opensea}
          height="50px"
          width="50px"
        />
        <div className={style.label}>Opensea</div>
      </a>
      <a
        target="blank"
        href={`https://testnet.rarible.com/token/polygon/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}:${id}?tab=overview`}
        className={style.imageBox}
      >
        <Image
          alt="img"
          loader={({ src }: any) => src}
          src={opensea}
          height="50px"
          width="50px"
        />
        <div className={style.label}>Rarible</div>
      </a>
    </div>
  );
};

// ================================ NftName ====================================
export const NftName = ({ name }: any) => {
  return <div className={style.nftName}>{name}</div>;
};
// ================================ NftMetaData ====================================
export const NftMetaData = ({ link }: any) => {
  return (
    <a
      target="blank"
      href={`https://gateway.pinata.cloud/ipfs/${link}`}
      className={style.metadataContainer}
    >
      <Launch sx={{ fontSize: "14px" }} /> metadata
    </a>
  );
};
// ================================ NftImageLink ====================================
export const NftImageLink = ({ link }: any) => {
  return (
    <a target="blank" href={link} className={style.imageLinkContainer}>
      <Launch sx={{ fontSize: "14px" }} /> Image Link
    </a>
  );
};
export const NftLoadingComponent = (props: any) => {
  const { loading, children } = props;
  if (loading) {
    return (
      <div className={style.loadingBox}>
        <CircularProgress color="success" />
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

// ================================ NftSellButton ====================================
export const NftSellButton = (props: any) => {
  const { price, forSale, currentOwner, refreshPage } = props;
  const [session]: any = useSession();
  const { query } = useRouter();
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const walletAddress = compressAddress(session?.walletAddress || "");

  const handleNftForSale = async () => {
    setLoading(true);
    const res = await updateNftForSale({
      forSale,
      tokenId: query.tokenId,
      session,
    });
    if (!res) {
      setLoading(false);
      setError("Failed to update");
      return;
    }
    refreshPage();
    setError("");
    setLoading(false);
  };

  const handleBuyNft = async () => {
    if (!forSale) return;
    setLoading(true);
    const approved = await approveToken({ price, session });
    if (!approved) {
      setLoading(false);
      setError("Failed to buy NFT");
      return;
    }
    const res = await buyNft({ tokenId: query.tokenId, session });
    if (!res) {
      setLoading(false);
      setError("Failed to buy NFT");
      return;
    }
    refreshPage();
    setError("");
    setLoading(false);
  };

  return (
    <div className={style.nftPrice}>
      <div className={style.nftPriceHead}>Price:&nbsp;{price}&nbsp;MSCN</div>
      {session?.walletAddress && (
        <>
          <div className={style.nftPriceBody}>
            {!loading && walletAddress === currentOwner ? (
              <Button variant="contained" onClick={handleNftForSale}>
                {forSale ? `Remove from NFT listing` : "Add to NFT listing"}
              </Button>
            ) : !loading ? (
              <Button onClick={handleBuyNft} variant="contained">
                {forSale ? `Buy NFT` : "Not for sale"}
              </Button>
            ) : null}
            {loading && <Button variant="contained">Processing...</Button>}
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </>
      )}
    </div>
  );
};
