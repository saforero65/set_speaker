import { DataContext } from "@/context/DataContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import rttmJson from "../../public/outputMutefire/mutefire_44000.json";
import rttmJsonToLive from "../../public/outputToLive/tolive_23000.json";

const Upload = ({ onFileUpload }) => {
  const { setData } = useContext(DataContext);

  const [uploading, setUploading] = useState(false);
  const [selectedSRT, setSelectedSRT] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [rttmWithSrt, setRttmWithSrt] = useState(null);
  useEffect(() => {
    if (rttmWithSrt) {
      setData(JSON.stringify(rttmWithSrt?.jsonRttm));
      onFileUpload();
    }
  }, [rttmWithSrt]);

  const handleUpload = async () => {
    setUploading(true);
    try {
      // console.log(selectedFile);
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myFile", selectedFile);

      console.log(" empieza el post upload");
      const { data } = await axios.post("/api/upload", formData);
      console.log("termina el post upload");
      console.log(data.filename);

      console.log(" empieza el post srtToJson");
      const jsonSrt = await axios.post("/api/srtToJson", {
        filename: data.filename,
      });
      console.log("termina el post srtToJson");

      console.log(" empieza el post setSpkSrt");
      //leer json de public y mandarlo a setSpkSrt
      const srtWithSpeakers = await axios.post("/api/setSpkSrt", {
        srt: jsonSrt.data.jsonSrt,
        rttm: rttmJson,
      });
      console.log("termina el post setSpkSrt");

      console.log(" empieza el post setSrtRttm");
      const rrttmWithSrt = await axios.post("/api/setSrtRttm", {
        srt: srtWithSpeakers.data.jsonSrt,
        rttm: rttmJson,
      });
      console.log("termina el post setSrtRttm");
      console.log("set rttm with srt");
      setRttmWithSrt(rrttmWithSrt.data);
      console.log("asignado");
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
  };
  const handleSetSrt = async (file) => {
    setUploading(true);
    try {
      // console.log(selectedFile);
      const file_name =
        file === "mutefire" ? "Mute_Fire_Sub_EN.srt" : "To_Live.srt";
      const rttmJsonSelected = file === "mutefire" ? rttmJson : rttmJsonToLive;

      console.log(" empieza el post srtToJson mutefire");

      const jsonSrt = await axios.post("/api/srtToJson", {
        filename: file_name,
      });
      console.log("termina el post srtToJson mutefire");

      console.log(" empieza el post setSpkSrt");
      //leer json de public y mandarlo a setSpkSrt
      const srtWithSpeakers = await axios.post("/api/setSpkSrt", {
        srt: jsonSrt.data.jsonSrt,
        rttm: rttmJsonSelected,
      });
      console.log("termina el post setSpkSrt");

      console.log(" empieza el post setSrtRttm");
      const rrttmWithSrt = await axios.post("/api/setSrtRttm", {
        srt: srtWithSpeakers.data.jsonSrt,
        rttm: rttmJsonSelected,
      });
      console.log("termina el post setSrtRttm");
      console.log("set rttm with srt");
      setRttmWithSrt(rrttmWithSrt.data);
      console.log("asignado");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[700px] bg-white">
        <div className="py-6 px-9 bg-slate-900 rounded-lg">
          <button
            className="hover:shadow-form w-middle rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            onClick={() => handleSetSrt("mutefire")}
          >
            Simula la carga del .srt MuteFire
          </button>
          <button
            className="hover:shadow-form w-middle rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none ml-6"
            onClick={() => handleSetSrt("tolive")}
          >
            Simula la carga del .srt To Live
          </button>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#fff]">
              Upload .srt
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
              onClick={handleUpload}
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
