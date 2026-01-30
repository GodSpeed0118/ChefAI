import { useMutation } from "@tanstack/react-query";
import { analyzeImage } from "../services/ai";
import { imageToBase64, getMimeType } from "../services/storage";

type AnalyzeImageInput = {
  uri: string;
};

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async ({ uri }: AnalyzeImageInput) => {
      const base64 = await imageToBase64(uri);
      const mimeType = getMimeType(uri);
      const result = await analyzeImage(base64, mimeType);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}
