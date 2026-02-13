// src/components/analysis/PalmAnalysisResult.tsx
import React, { useEffect, useState } from "react";
import PalmCanvas from "./PalmCanvas";
import PalmReport from "./PalmReport";
import { AnalysisData } from "./types";

interface Props {
  data: AnalysisData;
  imageUrl: string;
  onBack?: () => void;
}

const PalmAnalysisResult: React.FC<Props> = ({ data, imageUrl, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const lineOrder = data.lines.map((l) => l.name);
  const selectedLine = data.lines[activeLineIndex]?.name ?? null;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full max-w-[500px] mx-auto bg-white overflow-hidden text-black font-sans">
      <header className="flex-shrink-0 py-3 px-4 flex justify-between items-center z-30">
        <button
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="p-2 text-gray-500 hover:text-black -ml-2"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xs font-bold tracking-widest text-gray-500">손금 분석 결과</h1>
        <div className="w-10" />
      </header>

      <section className="flex-shrink-0 px-4 mb-2 h-[38vh] min-h-[200px]">
        <PalmCanvas
          imageUrl={imageUrl}
          data={data}
          selectedLine={selectedLine}
          isVisible={isVisible}
          onReset={() => {}}
        />
      </section>

      <section className="flex-1 min-h-0 overflow-hidden bg-gray-50 rounded-t-[2rem] border-t border-gray-200 relative">
        <PalmReport
          reportHtml={data.report}
          lineOrder={lineOrder}
          activeLineIndex={activeLineIndex}
          onLineIndexChange={setActiveLineIndex}
        />
      </section>
    </div>
  );
};

export default PalmAnalysisResult;