import { File } from "expo-file-system";

export async function imageToBase64(uri: string): Promise<string> {
  const file = new File(uri);
  return await file.base64();
}

export function getMimeType(uri: string): string {
  const extension = uri.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}
