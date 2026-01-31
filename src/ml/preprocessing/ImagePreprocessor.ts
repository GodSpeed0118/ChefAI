import * as ImageManipulator from 'expo-image-manipulator';

export const ImagePreprocessor = {
    /**
     * Scales and optimizes the image for AI model consumption.
     */
    prepareForInference: async (uri: string, width = 640, height = 640) => {
        console.log(`[ImagePreprocessor] Processing image: ${uri}`);

        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width, height } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        return result.uri;
    }
};
