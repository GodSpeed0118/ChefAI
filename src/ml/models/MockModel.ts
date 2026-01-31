import { DetectionModel, DetectionResult } from '../types';

export class MockModel implements DetectionModel {
    name = "ChefAI-Mock-Base";
    version = "1.0.0";

    async detect(imageUri: string): Promise<DetectionResult[]> {
        console.log(`[MockModel] Running inference on: ${imageUri}`);

        // Simulate network/processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            { ingredient: 'Organic Eggs', confidence: 0.98 },
            { ingredient: 'Whole Milk', confidence: 0.95 },
            { ingredient: 'Unsalted Butter', confidence: 1.0 },
            { ingredient: 'Baby Spinach', confidence: 0.88 },
        ];
    }
}
