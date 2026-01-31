export interface DetectionResult {
    ingredient: string;
    confidence: number;
    boundingBox?: {
        originX: number;
        originY: number;
        width: number;
        height: number;
    };
}

export interface DetectionModel {
    name: string;
    version: string;
    detect: (imageUri: string) => Promise<DetectionResult[]>;
    warmup?: () => Promise<void>;
}

export interface PipelineConfig {
    activeModel: string;
    preprocessing: {
        targetWidth: number;
        targetHeight: number;
        format: 'jpeg' | 'png';
    };
}
