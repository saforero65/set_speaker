import fs from "fs";
import * as srtparsejs from "srtparsejs"; // cjs
const subripToSeconds = (subripTime) => {
  let time = subripTime.split(":");
  let hours = parseInt(time[0]);
  let minutes = parseInt(time[1]);
  let seconds = parseInt(time[2].split(",")[0]);
  let milliseconds = parseInt(time[2].split(",")[1]);
  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};

const srtToJson = (filePath) => {
  return new Promise((resolve, reject) => {
    //carpeta public con filename
    // console.log(`${process.cwd()}/public/${filePath}`);
    fs.readFile(
      `${process.cwd()}/public/uploads/${filePath}`,
      "utf8",
      (err, data) => {
        if (err) reject(err);
        else {
          let parsed = srtparsejs.parse(data);
          parsed.forEach((item) => {
            item.startTime = subripToSeconds(item.startTime);
            item.endTime = subripToSeconds(item.endTime);
            item.speaker = "undefined";
          });
          resolve(parsed);
        }
      }
    );
  });
};
const handler = async (req, res) => {
  const file = await srtToJson(req.body.filename);
  //   const srtWithSpeakers =

  res.status(200).json({
    message: "todo bien",
    jsonSrt: file,
  });

  // res.status(200).json({
  //   filename: file.files.myFile.newFilename,
  //   message: "File uploaded successfully",
  // });
};

export default handler;
