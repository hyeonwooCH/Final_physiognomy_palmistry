export interface LineData {
    name: string;
    label: string;
    color: [number, number, number];
    points: [number, number][];
}

export interface ImageSize {
    width: number;
    height: number;
}

export interface AnalysisData {
    lines: LineData[];
    mounts: Record<string, [number, number]>;
    report: string;
    image_size: ImageSize;
}

export interface AnalysisProps {
    data: AnalysisData;
    imageUrl: string;
}