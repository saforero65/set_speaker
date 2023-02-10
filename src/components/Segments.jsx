import { DataContext } from "@/context/DataContext";
import { useContext, useEffect, useState } from "react";

const Segments = () => {
  const { data } = useContext(DataContext);
  const [segments, setSegments] = useState(null);
  useEffect(() => {
    if (data) {
      setSegments(JSON.parse(data));
    }
  }, [data]);

  const Segment = ({ segment }) => (
    <div className="segmentos">
      <div className="segmentos_details">
        <p>Start: {segment.start}</p>
        <p>Stop: {segment.stop}</p>
        <p className="speaker">Speaker: {segment.speaker}</p>
      </div>
      <div className="containerSegments">
        {segment?.segmentosSRT?.map((srt) => (
          <div className="segmentosSRT" key={srt.id}>
            <p className="speaker">ID: {srt.id}</p>
            <p>Start Time: {srt.startTime}</p>
            <p>End Time: {srt.endTime}</p>
            <p>Text: {srt.text}</p>
            {/* <p className="speaker">Speaker: {srt.speaker}</p> */}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="visualizaction">
      <h1> Visualizacion Segmentos con fragmentos del SRT MUTE FIRE </h1>
      {segments?.segmentos?.map((segment) => (
        <Segment key={segment.start} segment={segment} />
      ))}
    </div>
  );
};

export default Segments;
