export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ResultsParams = {
  ingredients: string; // JSON-stringified string[]
};
