export const approveToken = async (props: any) => {
  const { price, session } = props;
  const spender = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "";
  let host = "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_APP_URL || "";
  }
  const url = `${host}/api/erc20/approve`;

  const response: any = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      spender,
      amount: price,
      token: session?.privateKey,
      walletAddress: session?.walletAddress,
    }),
  }).catch((err: any) => console.log(err));
  const res = await response.json();
  if (res.success === false) return false;
  return res;
};

// ====================================== Buy NFT =========================================

export const buyNft = async (props: any) => {
  const { tokenId, session } = props;
  let host = "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_APP_URL || "";
  }
  const url = `${host}/api/nft/buy-nft`;

  const response: any = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: tokenId,
      token: session?.privateKey,
      walletAddress: session?.walletAddress,
    }),
  }).catch((err: any) => console.log(err));
  const res = await response.json();
  if (res.success === false) return false;
  return res;
};
// ====================================== Buy NFT =========================================

export const updateNftForSale = async (props: any) => {
  const { forSale, tokenId, session } = props;
  let host = "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_APP_URL || "";
  }
  const url = `${host}/api/nft/update-nft-for-sale`;

  const response: any = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      forSale,
      id: tokenId,
      token: session?.privateKey,
      walletAddress: session?.walletAddress,
    }),
  }).catch((err: any) => console.log(err));
  const res = await response.json();
  if (res.success === false) return false;
  return res;
};
