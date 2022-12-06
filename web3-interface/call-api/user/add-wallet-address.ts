export const addWalletAddressApiCall = async (props: any) => {
  const { walletAddress, token } = props;

  let host = "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_APP_URL || "";
  }

  const participateUrl = `${host}/api/user/add-wallet-address`;

  const response: any = await fetch(participateUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress, token }),
  }).catch((err: any) => console.log(err));
  const res = await response.json();
  if (res.success === false) return false;
  return true;
};
