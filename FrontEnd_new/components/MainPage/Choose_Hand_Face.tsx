"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface Props {
  userName: string;
  onFaceNext: () => void;
  onHandNext: () => void;
  onMatchingNext: () => void;
}

interface CardData {
  id: number;
  title: string;
  desc: string;
  icon: string;
  action: () => void;
}

export default function Choose_Hand_Face({ userName, onFaceNext, onHandNext, onMatchingNext }: Props) {
  const [[page, direction], setPage] = useState([0, 0]);

  const cards: CardData[] = [
    { id: 0, title: "천부적 관상", desc: "당신의 얼굴에 새겨진\n하늘의 뜻은?", icon: "👤", action: onFaceNext },
    { id: 1, title: "손금의 비밀", desc: "운명의 선들이 그려내는\n당신의 내일", icon: "✋", action: onHandNext },
    { id: 2, title: "운명적 궁합", desc: "서로의 기운이 만나는\n인연의 깊이는?", icon: "💖", action: onMatchingNext },
  ];

  // 무한 루프를 위한 인덱스 계산
  const activeIndex = ((page % cards.length) + cards.length) % cards.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      paginate(1); // 왼쪽으로 밀면 다음 카드
    } else if (info.offset.x > swipeThreshold) {
      paginate(-1); // 오른쪽으로 밀면 이전 카드
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white text-black overflow-hidden py-10">
      <div className="text-center mb-10 flex-none">
        <p className="text-gray-400 font-medium">환영합니다.</p>
        <h2 className="text-2xl font-bold border-b-2 border-black pb-1 inline-block">
          {userName || "사용자"} 님
        </h2>
      </div>

      <div className="flex-1 min-h-[20px]" />

      <div className="relative w-full max-w-sm flex items-center justify-center px-4 flex-none touch-none aspect-[3/4]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            onClick={cards[activeIndex].action}
            className="w-[280px] h-full bg-gray-50 border border-gray-200 rounded-[40px] shadow-xl flex flex-col items-center justify-between p-10 cursor-grab active:cursor-grabbing"
          >
            <div className="w-full py-4 bg-white rounded-2xl text-center border border-gray-100 shadow-sm pointer-events-none">
              <span className="font-bold text-xl">{cards[activeIndex].title}</span>
            </div>
            <div className="text-[100px] my-4 pointer-events-none select-none">
              {cards[activeIndex].icon}
            </div>
            <div className="text-center pointer-events-none">
              <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">
                {cards[activeIndex].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-[1.5] w-full flex flex-col items-center justify-center space-y-6">
        <div className="flex space-x-2">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "w-6 bg-black" : "w-1.5 bg-gray-300"
                }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 animate-pulse font-medium">
          카드를 클릭하여 운명 확인하기
        </p>
      </div>
    </div>
  );
}