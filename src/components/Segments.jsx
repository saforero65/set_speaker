import { DataContext } from "@/context/DataContext";
import { useContext, useEffect, useState } from "react";

const Segments = () => {
  const { data } = useContext(DataContext);
  const [segments, setSegments] = useState(null);
  useEffect(() => {
    if (data) {
      setSegments(JSON.parse(data).segmentos.sort((a, b) => a.start - b.start));

      converToArray(JSON.parse(data).total_segmentos_por_speaker);
    }
  }, [data]);
  const secondsToSubrip = (seconds) => {
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds % 3600) / 60);
    var second = Math.floor(seconds % 60);
    var millisecond = Math.floor((seconds % 1) * 1000);

    return (
      (hour > 9 ? hour : "0" + hour) +
      ":" +
      (minute > 9 ? minute : "0" + minute) +
      ":" +
      (second > 9 ? second : "0" + second) +
      "," +
      (millisecond > 99
        ? millisecond
        : millisecond > 9
        ? "0" + millisecond
        : "00" + millisecond)
    );
  };

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
        <p>Start: {secondsToSubrip(segment.start)}</p>
        <p>Stop: {secondsToSubrip(segment.stop)}</p>
        <p className="speaker">Speaker: {segment.speaker}</p>
      </div>
      <div className="containerSegments">
        {segment?.segmentosSRT?.map((srt) => (
          <div className="segmentosSRT" key={srt.id}>
            <p className="speaker">ID: {srt.id}</p>
            <p>Start Time: {secondsToSubrip(srt.startTime)}</p>
            <p>End Time: {secondsToSubrip(srt.endTime)}</p>
            <p>Text: {srt.text}</p>
            {/* <p className="speaker">Speaker: {srt.speaker}</p> */}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="visualizaction">
      <h1> Visualizacion Segmentos con Fragmentos </h1>
      <h3 className="speaker details">
        Total de Segementos: {JSON.parse(data)?.segmentos?.length}
      </h3>
      <h3 className="speaker details">
        Total de Speakers: {JSON.parse(data)?.total_speakers}
      </h3>
      <h3 className="speaker details">Total de Segmentos por Speakers:</h3>
      {converToArray(JSON.parse(data)?.total_segmentos_por_speaker).map(
        (item) => (
          <h3 className="speaker_details" key={item}>
            {item}
          </h3>
        )
      )}

      {segments?.map((segment) =>
        //si segmentosSRT es mayor a 0, entonces se muestra el segmento
        segment.segmentosSRT?.length > 0 ? (
          <Segment segment={segment} key={segment.start} />
        ) : null
      )}
    </div>
  );
};

export default Segments;
