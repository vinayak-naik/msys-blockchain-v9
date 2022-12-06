import { compressAddress } from "../../helper/conversion";
import { nftWeb3Methods } from "../../helper/web3Methods";

export const getNft = async (tokenId: any) => {
  console.log("getNft is running");
  try {
    const methods = await nftWeb3Methods();
    const res = await methods
      .nfts(tokenId)
      .call()
      .catch((err: any) => console.log(err));
    const owner = await methods
      .ownerOf(tokenId)
      .call()
      .catch((err: any) => console.log(err));
    if (!res.tokenUri) return;
    let nft;
    try {
      const promise = await fetch(
        `https://gateway.pinata.cloud/ipfs/${res.tokenUri}`
      );
      const data = await promise.json();

      nft = {
        tokenUri: res.tokenUri,
        forSale: res.forSale,
        hide: res.hide,
        price: Number(res.price),
        tokenId: Number(res.tokenId),
        owner: compressAddress(owner || ""),
        name: data.name,
        image: data.image,
        description: data.description,
        creator: compressAddress(data.creator || ""),
        createdAt: data.createdAt,
        background_color: data.background_color,
        attributes: data.attributes,
      };
    } catch (error) {
      nft = {
        tokenUri: res.tokenUri,
        forSale: res.forSale,
        hide: res.hide,
        price: Number(res.price),
        tokenId: Number(res.tokenId),
        owner: compressAddress(owner || ""),
        name: res.name,
        image: res.imageUrl,
        description: "",
        creator: compressAddress(""),
        createdAt: 0,
        background_color: "",
        attributes: [],
      };
    }
    return {
      success: true,
      data: nft,
      message: "",
    };
  } catch (error) {
    return { success: false, data: null, message: "Failed to get nft" };
  }
};
