export const getStoredFile = async (fileName: string) => {
  let host = "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_APP_URL || "";
  }
  try {
    const path = `${host}/api/get-file`;
    const res = await fetch(`${path}/${fileName}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch stored file");
    return {
      success: false,
      data: null,
      message: "Failed to fetch stored file",
    };
  }
};
