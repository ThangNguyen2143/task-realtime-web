export type ApiErrorPayload = {
  code?: number;
  status?: boolean;
  message?: string;
  value?: unknown;
};

export class ApiError extends Error {
  statusCode: number;
  code?: number;
  data?: unknown;

  constructor(params: {
    message: string;
    statusCode: number;
    code?: number;
    hint?: string;
    data?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.data = params.data;
  }
}

export async function parseErrorResponse(
  response: Response,
): Promise<ApiError> {
  let payload: ApiErrorPayload | null = null;

  try {
    payload = await response.clone().json();
  } catch {
    payload = null;
  }
  return new ApiError({
    message:
      payload?.message || `Request failed with status ${response.status}`,
    statusCode: response.status,
    code: payload?.code,
    data: payload?.value,
  });
}

export function normalizeUnknownError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      statusCode: 500,
    });
  }

  return new ApiError({
    message: "Unknown error",
    statusCode: 500,
  });
}
