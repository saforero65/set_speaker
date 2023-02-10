import { DataContext } from "@/context/DataContext";
import axios from "axios";
import { useContext, useState } from "react";
import rttmJson from "../../public/outputMutefire/mutefire_44000.json";

const Upload = ({ onFileUpload }) => {
  const { setData } = useContext(DataContext);

  const [uploading, setUploading] = useState(false);
  const [selectedSRT, setSelectedSRT] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [rttmWithSrt, setRttmWithSrt] = useState(null);

  const handleUpload = async () => {
    setUploading(true);
    try {
      // console.log(selectedFile);
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myFile", selectedFile);

      const { data } = await axios.post("/api/upload", formData);

      const jsonSrt = await axios.post("/api/srtToJson", {
        filename: data.filename,
      });

      //leer json de public y mandarlo a setSpkSrt
      const srtWithSpeakers = await axios.post("/api/setSpkSrt", {
        srt: jsonSrt.data.jsonSrt,
        rttm: rttmJson,
      });

      const rrttmWithSrt = await axios.post("/api/setSrtRttm", {
        srt: srtWithSpeakers.data.jsonSrt,
        rttm: rttmJson,
      });
      setRttmWithSrt(rrttmWithSrt.data);
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
  };
  function handleClick() {
    handleUpload();
    if (rttmWithSrt) {
      setData(JSON.stringify(rttmWithSrt?.jsonRttm));
      onFileUpload();
    }
  }
  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <div className="py-6 px-9 bg-slate-900 rounded-lg">
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#fff]">
              Upload .srt Mute Fire
            </label>

            <div className="mb-8">
              <input
                type="file"
                name="file"
                id="file"
                className="sr-only"
                onChange={({ target }) => {
                  if (target.files) {
                    const file = target.files[0];
                    // console.log(file);
                    setSelectedSRT(URL.createObjectURL(file));
                    setSelectedFile(file);
                    // console.log(selectedFile);
                    // console.log(selectedSRT);
                  }
                }}
              />
              <label
                htmlFor="file"
                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold text-[#fff]">
                    Drop files here
                  </span>
                  <span className="mb-2 block text-base font-medium text-[#fff]">
                    Or
                  </span>
                  <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#fff]">
                    Browse
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <button
              className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              onClick={handleClick}
            >
              Send File
            </button>
          </div>
        </div>
      </div>
      {/* <Segments rttmWithSrt={rttmWithSrt} /> */}
    </div>
  );
};

export default Upload;
