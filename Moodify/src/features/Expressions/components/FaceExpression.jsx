import React, { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";
    let animationFrameId;
    
export default function FaceExpression() {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);

  const [expression, setExpression] = useState("Loading...");

  
    async function initialize() {
      // Start webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;

      // Load MediaPipe
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      faceLandmarkerRef.current =
        await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          },
          runningMode: "VIDEO",
          outputFaceBlendshapes: true,
          numFaces: 1,
        });

      detectFace();
    }

    function detectExpression(blendshapes) {
    const getScore = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score || 0;

  const smileLeft = getScore("mouthSmileLeft");
  const smileRight = getScore("mouthSmileRight");

  const frownLeft = getScore("mouthFrownLeft");
  const frownRight = getScore("mouthFrownRight");

  const jawOpen = getScore("jawOpen");
  const browUp = getScore("browInnerUp");

  // Happy
  if (smileLeft > 0.5 && smileRight > 0.5) {
    return "😊 Happy";
  }

  // Sad
  if (frownLeft > 0.001 && frownRight > 0.001) {
    return "☹️ Sad";
  }

  // Surprised
  if (jawOpen > 0.4 && browUp > 0.4) {
    return "😲 Surprised";
  }

  // Neutral
  return "😐 Neutral";
}

  useEffect(() => {


    function detectFace() {
      if (
        !videoRef.current ||
        !faceLandmarkerRef.current ||
        videoRef.current.readyState < 2
      ) {
        animationFrameId = requestAnimationFrame(detectFace);
        return;
      }

      const results =
        faceLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

      if (results.faceBlendshapes?.length) {
        const blendshapes =
          results.faceBlendshapes[0].categories;

        const emotion = detectExpression(blendshapes);

        setExpression(emotion);
      }
    }

    initialize();

    return () => {
      cancelAnimationFrame(animationFrameId);

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Current Expression: {expression}</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="640"
        height="480"
      />
    </div>
  );
}