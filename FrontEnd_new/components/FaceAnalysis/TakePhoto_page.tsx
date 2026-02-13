"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  onBack: () => void;
  onStartAnalysis: (image: string) => void;
}

export default function TakePhoto_page({ onStartAnalysis, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setTimeout(() => {
        setStream(mediaStream);
      }, 0);
    } catch (err) {
      console.error("카메라 접근 에러:", err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);

      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white text-black min-h-0">
      {/* 상단 타이틀 */}
      <div className="w-full py-6 flex-none">
        <p className="text-center text-gray-500 text-sm font-medium">천부적 관상</p>
        <h2 className="text-center text-black text-xl font-bold mt-1 border-b-2 border-black pb-1 inline-block">
          얼굴을 촬영해주세요
        </h2>
      </div>

      {/* 카메라 프리뷰 영역 */}
      <div className="relative w-full flex-1 min-h-0 max-w-sm mx-auto aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-gray-300">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* 얼굴 가이드 오벌 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[70%] aspect-[3/4] rounded-[45%] border-2 border-white/60 border-dashed" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <p className="text-white text-xs bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                  얼굴을 타원형 가이드에 맞춰주세요
                </p>
              </div>
            </div>
          </>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={capturedImage}
            className="w-full h-full object-cover scale-x-[-1]"
            alt="촬영된 얼굴"
          />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* 하단 버튼 영역 */}
      <div className="w-full flex-none mt-6 mb-10 px-4">
        <div className="flex justify-around items-center max-w-xs mx-auto">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={capturedImage ? handleRetry : handleCapture}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all duration-200 bg-black text-white"
            >
              {capturedImage ? (
                <span className="font-bold text-xs text-center leading-tight">
                  다시
                  <br />
                  촬영
                </span>
              ) : (
                <div className="w-8 h-8 rounded-full border-4 border-white" />
              )}
            </button>
            <span className="text-xs text-gray-500">{capturedImage ? "재촬영" : "촬영"}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              disabled={!capturedImage}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                capturedImage
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => {
                if (capturedImage) {
                  onStartAnalysis(capturedImage);
                }
              }}
            >
              <span className="font-bold text-xs">분석하기</span>
            </button>
            <span className="text-xs text-gray-500">관상 분석</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-8 text-sm text-gray-500 hover:text-gray-700 underline w-full text-center transition-colors"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}
