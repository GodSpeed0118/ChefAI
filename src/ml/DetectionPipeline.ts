import { MockModel } from './models/MockModel';
import { ImagePreprocessor } from './preprocessing/ImagePreprocessor';
import { DetectionModel, DetectionResult } from './types';

export class DetectionPipeline {
    private model: DetectionModel;

    constructor(model: DetectionModel = new MockModel()) {
        this.model = model;
    }

    /**
     * Coordinates the full detection flow.
     */
    async process(imageUri: string): Promise<DetectionResult[]> {
        console.log('[DetectionPipeline] Starting detection pipeline...');

        try {
            // 1. Preprocessing
            const processedUri = await ImagePreprocessor.prepareForInference(imageUri);

            // 2. Inference
            const results = await this.model.detect(processedUri);

            console.log(`[DetectionPipeline] Success! Found ${results.length} ingredients.`);
            return results;
        } catch (error) {
            console.error('[DetectionPipeline] Pipeline error:', error);
            throw error;
        }
    }

    /**
     * Allows dynamic swapping of models at runtime.
     */
    setModel(model: DetectionModel) {
        this.model = model;
        console.log(`[DetectionPipeline] Switched to model: ${model.name}`);
    }
}

// Export singleton instance
export const detectionPipeline = new DetectionPipeline();
