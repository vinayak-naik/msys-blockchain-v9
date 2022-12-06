import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import style from "../../styles/pages/nft.module.css";
import useSWR from "swr";
import { CircularProgress } from "@mui/material";
import { getAllNfts } from "../../web3-interface/services/nft/get-all-nfts";
import HeaderComponent from "../../components/header/header";

const Nfts = () => {
  const { data } = useSWR("lotteries", getAllNfts);

  if (data && data.success)
    return (
      <div className={style.container}>
        <HeaderComponent />
        <div className={style.containerWrapper}>
          <div className={style.nftsContainer}>
            {data.data.map((item: any, index: number) => (
              <div key={index} className={style.gridItem}>
                <NftCard
                  name={item.name}
                  imageUrl={item.imageUrl}
                  price={item.price}
                  tokenId={item.tokenId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div style={styleObj}>
      <CircularProgress color="success" />
    </div>
  );
};

export default Nfts;

const NftCard = (props: any) => {
  const { push } = useRouter();
  const { name, price, imageUrl, tokenId } = props;
  return (
    <div className={style.nftCard} onClick={() => push(`/nft/${tokenId}`)}>
      <div className={style.imageContainer}>
        {imageUrl && (
          <Image
            alt="img"
            width="500px"
            height="500px"
            loader={({ src }: any) => src}
            src={imageUrl}
            style={{
              borderTopRightRadius: "12px",
              borderTopLeftRadius: "12px",
            }}
          />
        )}
      </div>
      <div className={style.nftCardDetails}>
        <div className={style.nftCardName}>Title: {name}</div>
        <div className={style.nftCardPrice}>Price: {price} MSCN</div>
      </div>
    </div>
  );
};
// ================================Objects=============================

const styleObj = {
  height: "80vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
