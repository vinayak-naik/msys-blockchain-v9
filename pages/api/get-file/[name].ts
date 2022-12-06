import { existsSync, readFileSync } from "fs";

export default async function getFile(req: any, res: any) {
  const { name } = req.query;
  const path = `/tmp/${name}.json`;

  try {
    const exists = existsSync(path);
    if (!exists) {
      res
        .status(400)
        .json({ success: false, data: [], message: "File not found" });
      return;
    }
    const rawFile = readFileSync(path, "utf-8");
    const file = JSON.parse(rawFile);
    res
      .status(200)
      .json({ success: true, data: file, message: "From stored data" });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: `Failed to get file in /tmp/${name}.json`,
    });
  }
  return;
}
