import Segments from "@/components/Segments";
import Upload from "@/components/Upload";
import { DataProvider } from "@/context/DataContext";
import { useState } from "react";

export default function Home() {
  const [showUpload, setShowUpload] = useState(true);

  const handleFileUpload = () => {
    setShowUpload(false);
  };
  return (
    <>
      <DataProvider>
        {showUpload && <Upload onFileUpload={handleFileUpload} />}
        {!showUpload && <Segments />}
      </DataProvider>
    </>
  );
}
