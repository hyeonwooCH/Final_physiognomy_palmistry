"use client";

import React, { useState } from "react";

interface Props {
  onNext: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userHand: "left" | "right" | null;
  setUserHand: (hand: "left" | "right") => void;
}

export default function MainPage({ onNext, userName, setUserName, userHand, setUserHand }: Props) {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [birth, setBirth] = useState("");

  const isBirthInvalid = birth.length > 0 && birth.length !== 8;
  const isAllValid = gender && userName && birth.length === 8 && userHand;

  return (
    <div className="flex flex-col items-center h-full w-full px-10 text-black bg-white">

      {/* 1. 상단 타이틀 영역 (여백 포함) */}
      <div className="flex-[2] flex items-center justify-center">
        <h1 className="text-2xl font-bold">로그인</h1>
      </div>

      {/* 2. 입력 및 선택 영역 (가운데 정렬 뭉치) */}
      <div className="flex-[5] w-full flex flex-col space-y-8">

        {/* 이름 & 생년월일 입력창 */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="성함을 입력해주세요"
            className="w-full h-12 px-4 border border-gray-400 rounded-md outline-none focus:border-black"
          />
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={birth}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 8) setBirth(value);
              }}
              placeholder="생년월일을 입력해주세요"
              className={`w-full h-12 px-4 border rounded-md outline-none focus:border-black ${isBirthInvalid ? "border-red-500" : "border-gray-400"
                }`}
            />
            {isBirthInvalid && (
              <p className="absolute -bottom-5 left-1 text-[10px] text-red-500">
                * 숫자 8자리를 입력해주세요.
              </p>
            )}
          </div>
        </div>

        {/* 성별 선택 */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-500">성별 선택</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-3 border rounded-md transition-all ${gender === "male" ? "bg-black text-white border-black" : "border-gray-400 text-gray-500"
                }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-3 border rounded-md transition-all ${gender === "female" ? "bg-black text-white border-black" : "border-gray-400 text-gray-500"
                }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 주손 선택 */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-500">주손 선택</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setUserHand("left")}
              className={`flex-1 py-3 border rounded-md transition-all ${userHand === "left" ? "bg-black text-white border-black" : "border-gray-400 text-gray-500"
                }`}
            >
              왼손
            </button>
            <button
              onClick={() => setUserHand("right")}
              className={`flex-1 py-3 border rounded-md transition-all ${userHand === "right" ? "bg-black text-white border-black" : "border-gray-400 text-gray-500"
                }`}
            >
              오른손
            </button>
          </div>
        </div>
      </div>

      {/* 3. 하단 버튼 영역 */}
      <div className="flex-[3] w-full flex items-center justify-center">
        <button
          disabled={!isAllValid}
          onClick={onNext}
          className={`w-[272px] py-4 rounded-2xl font-bold text-lg transition-all ${isAllValid ? "bg-black text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          완료
        </button>
      </div>

    </div>
  );
}