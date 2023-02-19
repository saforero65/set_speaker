const joinSRTtoRTTM = (srt, rttm) => {
  let holgura = 1;
  const segmentosIgnorados = [];

  //itera sobre los segmentos del rttm
  srt.forEach((item, index) => {
    let startSRT = item.startTime;
    let endSRT = item.endTime;
    let segmentoAceptado = false;

    rttm.segmentos.forEach((itemRTTM) => {
      let start = itemRTTM.start;
      let end = itemRTTM.stop;
      let speaker = itemRTTM.speaker;
      if (typeof start === "string") {
        start = parseFloat(start);
      }
      if (typeof end === "string") {
        end = parseFloat(end);
      }

      //si el srt esta entre el tiempo incial y final del rttm asignar segmento con holgura de 1 segundo

      if (start - holgura <= startSRT && end + holgura >= endSRT) {
        if (!itemRTTM.segmentosSRT) {
          itemRTTM.segmentosSRT = [];
        }
        //asigna el segmento del srt al segmento del rttm
        itemRTTM.segmentosSRT.push(item);
        segmentoAceptado = true;
      }
    });

    !segmentoAceptado ? segmentosIgnorados.push(item) : null;
  });

  return [rttm, segmentosIgnorados];
};

const compareAssignSpeaker = (json) => {
  let segmentos = [];

  json.forEach((element, index) => {
    if (index < json.length - 1) {
      if (json[index].speaker === json[index + 1].speaker) {
        if (json[index].id == json[index + 1].id - 1) {
          //si el speaker no esta en el objeto agregarlo
          if (!segmentos[json[index].speaker]) {
            segmentos[json[index].speaker] = new Set();
          }
          //agregar el id al objeto
          segmentos[json[index].speaker].add(json[index]);
          segmentos[json[index].speaker].add(json[index + 1]);
        }
      }
    }
  });
  let containerSegments = [];
  let endTime = 0;
  for (const speaker in segmentos) {
    const speakerSegment = new Set();
    let startTime = Array.from(segmentos[speaker])[0].startTime;

    let speakerLabel = speaker;
    Array.from(segmentos[speaker]).forEach((element, index) => {
      if (index < Array.from(segmentos[speaker]).length - 1) {
        //si los id estan en secuencia guardar en un arreglo
        if (element.id == Array.from(segmentos[speaker])[index + 1].id - 1) {
          speakerSegment.add(element);
          speakerSegment.add(Array.from(segmentos[speaker])[index + 1]);
        } else {
          //crear un nuevo objeto y guardar el segmento
          const obj = {
            speaker: speakerLabel,
            start: startTime,
            stop: element.endTime,
            segmentosSRT: Array.from(speakerSegment),
          };
          containerSegments.push(obj);
          speakerSegment.clear();
          startTime = Array.from(segmentos[speaker])[index + 1].startTime;
          endTime = Array.from(segmentos[speaker])[index + 1].endTime;
        }
      }
    });
    const obj = {
      speaker: speakerLabel,
      start: startTime,
      stop: endTime,
      segmentosSRT: Array.from(speakerSegment),
    };

    containerSegments.push(obj);
  }
  return containerSegments;
};

const joinSegmentsRTTM = (containerSegments, rttm) => {
  //unir los segmentos con el rttm

  rttm.segmentos.push(...containerSegments);
  return rttm;
};

const handler = (req, res) => {
  try {
    const srt = req.body.srt;
    const rttm = req.body.rttm;

    const [rttmWithSpeakers, segmentosIgnorados] = joinSRTtoRTTM(srt, rttm);
    console.log(segmentosIgnorados.length);
    const containerSegmentsUndefined = compareAssignSpeaker(segmentosIgnorados);
    const rttmJson = joinSegmentsRTTM(
      containerSegmentsUndefined,
      rttmWithSpeakers
    );

    res.status(200).json({
      message: "todo bien",
      jsonRttm: rttmJson,
    });
  } catch (error) {
    res.status(500).json({
      message: "paila",
      error: error,
    });
  }
};

export default handler;
