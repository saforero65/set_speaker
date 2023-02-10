import { DataContext } from "@/context/DataContext";
import { useContext, useEffect, useState } from "react";

const Segments = () => {
  const { data } = useContext(DataContext);
  const [segments, setSegments] = useState(null);
  useEffect(() => {
    if (data) {
      setSegments(JSON.parse(data));
      converToArray(JSON.parse(data).total_segmentos_por_speaker);
    }
  }, [data]);

  const converToArray = (obj) => {
    let arr = [];
    for (let key in obj) {
      arr.push(`${key}: ${obj[key]}`);
    }
    console.log(arr);
    return arr;
  };

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
      <h3 className="speaker details">
        Total de Segementos: {segments?.segmentos?.length}
      </h3>
      <h3 className="speaker details">
        Total de Speakers: {segments?.total_speakers}
      </h3>
      <h3 className="speaker details">Total de Segmentos por Speakers:</h3>
      {converToArray(segments?.total_segmentos_por_speaker).map((item) => (
        <h3 className="speaker_details" key={item}>
          {item}
        </h3>
      ))}

      {segments?.segmentos?.map((segment) => (
        <Segment key={segment.start} segment={segment} />
      ))}
    </div>
  );
};

export default Segments;
