import React from "react";
import {
  NftDescription,
  NftImage,
  NftImageLink,
  NftLoadingComponent,
  NftMetaData,
  NftName,
  NftProperties,
  NftSellButton,
  OpenseaLink,
  OwnerContainer,
} from "../../components/molecules/nftDetails";
import style from "../../styles/pages/nftDetails.module.css";
import useSWR from "swr";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { getNft } from "../../web3-interface/services/nft/get-nft";
import HeaderComponent from "../../components/header/header";

const NftDetails = () => {
  const { query } = useRouter();
  const id = query.tokenId;
  const { data, mutate } = useSWR(id ? id : null, getNft);

  const nft = data?.data;

  if (data && data.success)
    return (
      <NftLoadingComponent loading={false}>
        <HeaderComponent />
        <div className={style.container}>
          <div className={style.containerLeftBox}>
            <NftImage link={nft?.image} />
            <NftImageLink link={nft?.image} />
            <NftDescription description={nft?.description} />
            <NftProperties properties={nft?.attributes} />
          </div>
          <div className={style.containerRightBox}>
            <NftName name={nft?.name} />
            <NftMetaData link={nft?.tokenUri} />
            <OwnerContainer creator={nft?.creator} currentOwner={nft?.owner} />
            <NftSellButton
              price={nft?.price}
              forSale={nft?.forSale}
              currentOwner={nft?.owner}
              refreshPage={mutate}
            />
            <OpenseaLink />
          </div>
        </div>
      </NftLoadingComponent>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default NftDetails;

// ================================Objects=============================

const styleObj = {
  height: "80vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
