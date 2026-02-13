"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image"; // Next.js의 이미지 최적화 컴포넌트
import PrimaryButton from "@/components/Ui/Buttons";

interface Props {
  onNext: () => void;
}

// export default는 "이 파일을 다른 데서 쓸 수 있게 내보낸다"는 뜻입니다.
export default function Main_Login_Form({ onNext }: Props) {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer); // 페이지를 나가면 타이머 청소
  }, []);

  return (
    <div className="flex flex-col items-center h-full w-full">

      {/* 로고와 "손금과 관상" */}
      {/* 상단 여백 */}
      <div className={`flex-[${1.5}] w-full`} />

      <div className="flex-[7.5] flex flex-col items-center w-full">
        {/* 로고 및 텍스트 영역  */}
        <div className="flex flex-col items-center flex-none">
          <div className="relative w-48 h-48 mb-[17px]"> {/* 이미지-텍스트 간격 17px 고정 */}
            <Image
              src="/images/Main_Ikon.png"
              alt="관상과 손금 로고"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="text-[#000000] text-xl font-medium">내가 너 그럴줄 알았다</p>
        </div>

        {/* 3. 하단 버튼 영역 (비율 C) : 텍스트와 버튼 사이의 간격 및 버튼 위치 */}
        {/* 3. 중간 여백 (비율 B): 로고와 버튼 사이의 간격 */}
        {/* 💡 이 숫자를 키우면 버튼이 아래로 멀어집니다! */}
        <div className="flex-[2.5] w-full" />
        {/*버튼*/}
        <div className={`flex-none transition-opacity duration-1000 ${showButton ? "opacity-100" : "opacity-0"}`}>
          <PrimaryButton label="시작" onClick={onNext} />
        </div>
        <div className="flex-[2.5] w-full" />
      </div>
    </div>
  );
}