"use client";

import React from "react";

interface ButtonProps {
    label: string;             // 버튼에 들어갈 글자
    onClick?: () => void;      // 클릭 시 실행할 함수 (선택사항)
    type?: "button" | "submit"; // 버튼 타입
    variant?: "primary" | "secondary" | "outline"; // 디자인 종류
    className?: string;        // 추가로 스타일을 덮어쓰고 싶을 때
    disabled?: boolean;        // 비활성화 상태
}

export default function Button({
    label,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
}: ButtonProps) {
    // 변수 (global.css)를 활용한 기본 스타일 조립
    const baseStyles = "w-[272px] py-3 rounded-full font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    // 종류별 디자인 분기 
    const variants = {
        primary: "bg-[#4B4B4B] text-white hover:bg-[#606060] shadow-lg",
        secondary: "bg-[var(--background)] border-2 border-[#E2C37B] text-[#E2C37B] hover:bg-[#E2C37B] hover:text-[var(--background)]",
        outline: "bg-transparent border border-white/30 text-white hover:bg-white/10",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {label}
        </button>
    );
}
