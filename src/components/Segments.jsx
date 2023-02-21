import { DataContext } from "@/context/DataContext";
import { useContext, useEffect, useState } from "react";

const Segments = () => {
  const { data } = useContext(DataContext);
  const [segments, setSegments] = useState(null);
  useEffect(() => {
    if (data) {
      setSegments(
        JSON.parse(data).segmentos?.sort((a, b) => a.start - b.start)
      );
      console.log(JSON.parse(data));
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

    return arr;
  };
  const Segment = ({ segment }) => (
    <div
      className={segment.speaker === "empty" ? "segmentosEmpty" : "segmentos"}
    >
      <div className="segmentos_details">
        {segment.speaker === "empty" ? (
          <p className="speaker">Segment Descriptor </p>
        ) : null}
        <p>Start: {secondsToSubrip(segment.start)}</p>
        <p>End: {secondsToSubrip(segment.stop)}</p>
        {segment.speaker === "empty" ? (
          <p>Duration: {segment.duration.toFixed(3)} seg</p>
        ) : null}
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
        Total Segments: {JSON.parse(data)?.total_segmentos}
      </h3>
      <h3 className="speaker details">
        Total segments for description (greater than 1 second):{" "}
        {JSON.parse(data)?.total_segmentos_vacios}
      </h3>
      <h3 className="speaker details">
        Total Ignored Subtitles: {JSON.parse(data)?.totalSegmentsIgnored}
      </h3>
      <h3 className="speaker details">
        IDs Ignored Subtitles:{" "}
        {JSON.parse(data)?.segmentsSrtIgnored.map((item) => (
          <p style={{ display: "inline" }} key={item}>
            {item + ", "}
          </p>
        ))}
      </h3>
      <h3 className="speaker details">
        Total Speakers: {JSON.parse(data)?.total_speakers}
      </h3>
      <h3 className="speaker details">Total Segments per Speaker:</h3>
      {converToArray(JSON.parse(data)?.total_segmentos_por_speaker).map(
        (item) => (
          <h3 className="speaker_details" key={item}>
            {item}
          </h3>
        )
      )}

      {segments?.map((segment) =>
        //si segmentosSRT es mayor a 0, entonces se muestra el segmento
        segment || segment.speaker == "empty" ? (
          <Segment segment={segment} key={segment.start} />
        ) : null
      )}
    </div>
  );
};

export default Segments;
