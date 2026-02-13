import React from 'react';
import Image from 'next/image';
import { AnalysisData } from './types';

interface Props {
    imageUrl: string;
    data: AnalysisData;
    selectedLine: string | null;
    isVisible: boolean;
    onReset: () => void;
}

const PalmCanvas: React.FC<Props> = ({ imageUrl, data, selectedLine, isVisible, onReset }) => {
    const { width: imgW, height: imgH } = data.image_size;
    const aspectRatio = imgH / imgW;

    // ✅ 서버 데이터 키값 -> 화면에 표시할 한자 매핑 (오류 해결 1)
    const mountLabels: Record<string, string> = {
        "금": "金",
        "목성": "木",
        "토성": "土",
        "태양": "日",
        "수성": "水",
        "제2화성": "火",
        "월구": "月",
        "地": "地",
        "火": "火"
    };

    return (
        <div
            className="relative w-full overflow-hidden rounded-[2.5rem] border border-gray-300 shadow-lg bg-black"
            // ✅ 컨테이너 자체를 이미지 종횡비와 완벽히 일치시킴
            style={{ paddingBottom: `${aspectRatio * 100}%` }}
        >
            <div className="absolute inset-0">
                {/* 배경 이미지 */}
                <Image
                    src={imageUrl}
                    alt="Hand Analysis"
                    fill
                    // ✅ object-fill을 사용하여 SVG 좌표계와 이미지 픽셀을 1:1로 일치시킴 (오류 해결 2: Overlay 어긋남 방지)
                    className={`transition-all duration-1000 object-fill ${selectedLine ? 'opacity-30 blur-md scale-105' : 'opacity-100'
                        }`}
                    unoptimized
                />

                {/* 분석 레이어 (SVG) */}
                <svg
                    viewBox={`0 0 ${imgW} ${imgH}`}
                    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                    // ✅ xMidYMid meet으로 설정하여 이미지와 선이 항상 같은 비율로 확장되게 함
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* 손금 선 렌더링 */}
                    {data.lines.map((line) => {
                        const isFocused = !selectedLine || selectedLine === line.name;
                        const isSelected = selectedLine === line.name;

                        return (
                            <polyline
                                key={line.name}
                                points={line.points.map((p) => `${p[0]},${p[1]}`).join(' ')}
                                fill="none"
                                stroke={isSelected ? "#ffffff" : `rgb(${line.color.join(',')})`}
                                strokeWidth={isSelected ? "22" : "10"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    opacity: isVisible && isFocused ? 1 : 0.05,
                                    filter: isSelected ? 'drop-shadow(0 0 15px #fff)' : 'none',
                                    transition: 'all 0.5s ease-in-out',
                                }}
                            />
                        );
                    })}

                    {/* ✅ 구역(Mounts) 문자 표시 (오류 해결 3) */}
                    {data.mounts && Object.entries(data.mounts).map(([name, coords]) => {
                        const mountVisible = isVisible && !selectedLine;
                        const label = mountLabels[name] || name;

                        return (
                            <g key={`mount-${name}`} style={{ opacity: mountVisible ? 1 : 0, transition: 'opacity 0.5s' }}>
                                {/* 구역 강조 원 (반투명) */}
                                <circle
                                    cx={coords[0]}
                                    cy={coords[1]}
                                    r="50"
                                    fill="rgba(0, 0, 0, 0.2)"
                                    stroke="rgba(0, 0, 0, 0.5)"
                                    strokeWidth="2"
                                />
                                {/* 구역 텍스트 (한자) */}
                                <text
                                    x={coords[0]}
                                    y={coords[1]}
                                    dy="0.35em"
                                    textAnchor="middle"
                                    fill="#ffffff"
                                    fontSize="32"
                                    fontWeight="900"
                                    style={{
                                        paintOrder: 'stroke',
                                        stroke: 'rgba(0,0,0,0.6)',
                                        strokeWidth: '4px'
                                    }}
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

            </div>
        </div>
    );
};

export default PalmCanvas;