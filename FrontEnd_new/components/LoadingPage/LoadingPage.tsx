"use client";
import React, { useState, useEffect } from "react";

interface Props {
    onNext?: () => void;
    userName: string;
}

const LOADING_TEXTS = [
    "하늘의 기운이 손금의 선을 따라 당신의 이야기를 읽어내고 있습니다",
    "저희 앱은 실제 관상학 서적을 기본으로 하고 있어요! 꼼꼼하게 보고 정확하게 알려드릴게요! 조금만 기다려주세요! ㅜㅜ",
    "알고 계셨나요? 얼굴은 나이가 들수록 운명보다 습관이 드러납니다. 관상학에서는 50세 이후 얼굴은 본인 책임 이라는 말도 있답니다!",
    "관상학에서 이마는 초년운, 사고방식을 의미해요! 눈은 인간관계, 감정을 의미하고 코는 재물, 현실 감각을 의미한답니다!",
    "관상학에서는 잘생김보다는 안 피곤해 보이는 얼굴이 최고랍니다! 편안해 보이는 얼굴은 운이 좋은 얼굴이예요! 당신은 운이 좋은 사람인가요??",
    "코가 크면 부자?? 에이~ 크기보다는 안정감이 좋아요! 코가 작아도 단단하고 중심이 잡혀 있으면 짱이랍니다!",
    "손금은 좌우 역할이 다르답니다! 주로 쓰는 손은 현재, 후천적 변화를 확인할 수 있어요! 비주손은 타고난 성향을 확인할 수 있어요!",
    "손금은 계절, 컨디션에 따라 미세하게 변합니다! 스트레스가 심하면 선이 흐려져 제대로 손금을 보기가 어려워요!..",
    "생명선이 짧다고 단명한다고요?? 생명선은 에너지 사용 방식을 의미해요! 짧아도 굵고 선명하면 활동력이 좋은거예요! 단명하지 않아요!",
    "결혼선은 결혼 횟수가 아니예요!! 결혼선은 관계의 깊이, 감정 몰입 경험을 의미해요 굵은 한 줄은 강렬한 관계 하나를 의미한다고요!",
    "손금이 안 나오는 경우는 매우 귀한 손금이예요! 당신은 특별한 사람입니다!"
];

export default function LoadingPage({ userName }: Props) {
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % LOADING_TEXTS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full animate-fadeIn text-black">

            {/* 1. 메인 애니메이션 영역 (고정) */}
            <div className="relative flex items-center justify-center w-64 h-80 mb-12 flex-none">
                <div className="absolute w-48 h-48 border-2 border-gray-200 rounded-full animate-[spin_8s_linear_infinite]" />
                <div className="absolute w-40 h-40 border-2 border-dashed border-gray-300 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                <div className="absolute w-28 h-28 border-t-4 border-b-4 border-transparent border-l-black border-r-black rounded-full animate-spin" />
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl animate-pulse">
                        🔮
                    </span>
                </div>
            </div>

            {/* 2. 텍스트 영역 */}
            <div className="text-center px-8 w-full max-w-[400px]">
                <h1 className="text-lg text-black tracking-[0.2em] font-bold">
                    {userName}님의 운명을 분석 중...
                </h1>

                <div className="w-48 h-[1px] bg-gray-300 mx-auto mt-4" />

                <div className="mt-6 min-h-[100px] flex items-start justify-center">
                    <p
                        key={textIndex}
                        className="text-gray-500 text-xs leading-loose animate-fadeIn tracking-widest break-keep"
                    >
                        {LOADING_TEXTS[textIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
}