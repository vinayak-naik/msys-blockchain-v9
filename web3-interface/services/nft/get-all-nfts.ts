import { nftWeb3Methods } from "../../helper/web3Methods";

export const getAllNfts = async () => {
  try {
    const methods = await nftWeb3Methods();
    const result = await methods
      .getAllNfts()
      .call()
      .catch((err: any) => console.log(err));

    let nfts: any = [];
    result.forEach((item: any) => {
      const nft = {
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        tokenId: item.tokenId,
      };
      nfts.push(nft);
    });

    return {
      success: true,
      data: nfts,
      message: "",
    };
  } catch (error) {
    return { success: false, data: null, message: "Failed to get nfts" };
  }
};
