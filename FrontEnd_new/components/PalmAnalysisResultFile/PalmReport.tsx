"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { parseReportToCards } from "./parseReport";

interface Props {
  reportHtml: string;
  lineOrder: string[];
  activeLineIndex: number;
  onLineIndexChange: (index: number) => void;
}

export default function PalmReport({
  reportHtml,
  lineOrder,
  activeLineIndex,
  onLineIndexChange,
}: Props) {
  const cards = parseReportToCards(reportHtml, lineOrder);
  const [sheetHeight, setSheetHeight] = useState(0); // 0=peek, 1=half, 2=full
  const scrollRef = useRef<HTMLDivElement>(null);
  const safeIndex = Math.min(activeLineIndex, Math.max(0, cards.length - 1));
  const currentCard = cards[safeIndex];

  useEffect(() => {
    if (!scrollRef.current || cards.length === 0) return;
    const el = scrollRef.current;
    const cardWidth = el.offsetWidth;
    el.scrollTo({ left: safeIndex * cardWidth, behavior: "smooth" });
  }, [safeIndex, cards.length]);

  const handleScroll = () => {
    if (!scrollRef.current || cards.length === 0) return;
    const el = scrollRef.current;
    const cardWidth = el.offsetWidth || 1;
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== activeLineIndex && idx >= 0 && idx < cards.length) {
      onLineIndexChange(idx);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const vy = info.velocity.y;
    const dy = info.offset.y;
    if (dy < -50 || vy < -200) {
      setSheetHeight(2);
    } else if (dy > 50 || vy > 200) {
      setSheetHeight(0);
    }
  };

  const expandSheet = () => setSheetHeight(2);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* 손금 선택 가이드 */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <p className="text-gray-500 text-xs font-medium mb-1">← 오른쪽으로 스와이프하여 다음 손금 보기 →</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {cards.map((card, i) => (
            <button
              key={card.lineKey}
              onClick={() => onLineIndexChange(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${i === activeLineIndex
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
            >
              {card.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 가로 스크롤: 손금별 카드 영역 - 오른쪽으로 슬라이드 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide touch-pan-x"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex h-full min-h-[80px]">
          {cards.length === 0 ? (
            <div className="flex-shrink-0 w-full flex items-center justify-center text-gray-500 text-sm">
              분석 결과를 불러오는 중...
            </div>
          ) : (
            cards.map((card, i) => (
              <div
                key={card.lineKey}
                className="flex-shrink-0 w-full snap-center px-4 flex flex-col"
                style={{ minWidth: "100%" }}
              >
                <div className="text-center py-4">
                  <span className="text-lg font-bold text-black">{card.label}</span>
                  <p className="text-xs text-gray-500 mt-2">↓ 아래 카드를 위로 당겨 자세한 내용 보기</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 하단 슬라이드업 카드 (바텀시트) */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-200"
        initial={false}
        animate={{
          height:
            sheetHeight === 2
              ? "85vh"
              : sheetHeight === 1
                ? "50vh"
                : "180px",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
      >
        {/* 드래그 핸들 - 탭하여 펼치기/접기 */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onClick={() => (sheetHeight === 0 ? expandSheet() : setSheetHeight(0))}
        >
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* 현재 손금 제목 */}
        <div
          className="px-6 pb-3 flex-shrink-0 flex items-center justify-between"
          onClick={() => sheetHeight === 0 && expandSheet()}
        >
          <div>
            <h3 className="text-xl font-bold text-black">
              {currentCard?.label ?? "손금 분석"}
            </h3>
            {sheetHeight === 0 && (
              <p className="text-sm text-gray-500 mt-1">↑ 위로 당기거나 탭하여 자세히 보기</p>
            )}
          </div>
          {sheetHeight === 2 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSheetHeight(0); }}
              className="p-2 -mr-2 text-gray-500 hover:text-black rounded-full"
              aria-label="접기"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* 스크롤 가능한 내용 영역 - 위로 당기면 펼쳐짐 */}
        <div
          className={`overflow-y-auto px-6 pb-8 -webkit-overflow-scrolling-touch transition-all ${sheetHeight === 0 ? "max-h-0 overflow-hidden opacity-0" : "flex-1 opacity-100 min-h-[200px]"
            }`}
        >
          {currentCard && (
            <div
              className="text-gray-700 leading-relaxed text-[15px] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: currentCard.contentHtml }}
              style={{
                lineHeight: 1.8,
              }}
            />
          )}
        </div>
      </motion.div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .prose b {
          font-weight: 700;
          color: #111;
        }
      `}</style>
    </div>
  );
}
