import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};
const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "public", "uploads");

    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  //max file size 5gb
  options.maxFileSize = 5 * 1024 * 1024 * 1024; //explica esto  5 * 1024 * 1024 * 1024 = 5gb

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      // console.log(fields, files);
      resolve({ fields, files });
    });
  });
};

const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd(), "public", "uploads"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd(), "public", "uploads"));
  }

  const file = await readFile(req, true);

  res.status(200).json({
    filename: file.files.myFile.newFilename,
    message: "File uploaded successfully",
  });
};

export default handler;
