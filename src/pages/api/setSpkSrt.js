const joinRTTM_SRT = (srt, rttm) => {
  let holgura = 1;

  rttm.segmentos.forEach((item) => {
    let start = parseFloat(itemRTTM.start);
    let end = parseFloat(itemRTTM.stop);
    let speaker = item.speaker;
    srt.forEach((sub) => {
      if (start - holgura <= sub.startTime && end + holgura >= sub.endTime) {
        sub.speaker = speaker;
      }
    });
  });

  return srt;
};

const compareAssignSpeaker = (json) => {
  // let contador = 0;
  json.forEach((item, index) => {
    if (item.speaker === "undefined") {
      //ver el objeto anterior y el siguiente y asignar si son iguales

      if (index > 0 && index < json.length - 1) {
        if (json[index - 1].speaker === json[index + 1].speaker) {
          item.speaker = json[index - 1].speaker;
        }
        //si los dos no son iguales ver el objeto anterior y asignar el speaker
        else if (json[index - 1].speaker !== json[index + 1].speaker) {
          item.speaker = json[index - 1].speaker;
        }
        //si el objeto anterior no tiene speaker asignar el del siguiente
      } else if (index === 0) {
        item.speaker = json[index + 1].speaker;
        //si el siguiente es undefined seguir hasta encontrar un speaker
        if (item.speaker === "undefined") {
          let i = 1;
          while (item.speaker === "undefined") {
            item.speaker = json[index + i].speaker;
            i++;
          }
        }
      } else {
        item.speaker = json[index - 1].speaker;
      }
      // contador++;
    }
  });
  // console.log(contador);
  return json;
};

const handler = (req, res) => {
  try {
    const srt = req.body.srt;
    const rttm = req.body.rttm;

    const srtWithSpeakers = joinRTTM_SRT(srt, rttm);

    const assignUndefined = compareAssignSpeaker(srtWithSpeakers);

    res.status(200).json({
      message: "todo bien",
      jsonSrt: assignUndefined,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

export default handler;
