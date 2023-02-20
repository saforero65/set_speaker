const joinSRTtoRTTM = (srt, rttm) => {
  let holgura = 1.5;
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
          endTime = Array.from(segmentos[speaker])[index + 1].endTime;
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
        }
      }
    });
    console.log(endTime);
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
const generateEmptySegmentsArray = (originalArray) => {
  const newArray = [];
  for (let i = 0; i < originalArray.length - 1; i++) {
    //si el tiempo entre el segmento y el siguiente es mayor a 1 segundo
    if (originalArray[i + 1].start - originalArray[i].stop > 1) {
      const emptySegment = {
        start: originalArray[i].stop,
        stop: originalArray[i + 1].start,
        duration: originalArray[i + 1].start - originalArray[i].stop,
        speaker: "empty",
      };
      newArray.push(emptySegment);
    }
  }

  return newArray;
};
const joinSegmentsRTTM = (containerSegments, rttm) => {
  //unir los segmentos con el rttm

  rttm.segmentos.push(...containerSegments);
  return rttm;
};
const verifiedIgnoredSegments = (srt, rttm) => {
  let segmentsSrt = [];
  rttm.segmentos.forEach((element) => {
    if (element.segmentosSRT) {
      Array.from(element.segmentosSRT).forEach((item) => {
        segmentsSrt.push(parseInt(item.id));
      });
    }
  });
  //hacer un arreglo de uno hasta el ultimo id del srt
  let arraySrt = Array.from({ length: srt.length }, (_, i) => i + 1);

  //obtener los numeros que no estan en el arreglo de los segmentos
  let noEstanEnSegmentos = arraySrt.filter((x) => !segmentsSrt.includes(x));
  let noEstanEnSrt = segmentsSrt.filter((x) => !arraySrt.includes(x));
  let segmentsSrtIgnored = noEstanEnSegmentos.concat(noEstanEnSrt);

  return segmentsSrtIgnored;
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

    const segmentsSrtIgnored = verifiedIgnoredSegments(srt, rttmJson);

    const rttmJsonWithEmptySegments = generateEmptySegmentsArray(
      rttmJson.segmentos.sort((a, b) => a.start - b.start)
    );
    const total_segmentos = rttmJson.segmentos.length;
    const joinAll = joinSegmentsRTTM(rttmJsonWithEmptySegments, rttmJson);
    joinAll.total_segmentos = total_segmentos;
    joinAll.total_segmentos_vacios = rttmJsonWithEmptySegments.length;
    joinAll.segmentsSrtIgnored = segmentsSrtIgnored;
    joinAll.totalSegmentsIgnored = segmentsSrtIgnored.length;

    res.status(200).json({
      message: "todo bien",
      jsonRttm: joinAll,
    });
  } catch (error) {
    res.status(500).json({
      message: "paila",
      error: error,
    });
  }
};

export default handler;
