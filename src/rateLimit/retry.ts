type RetryOptions = {
  maxRetries?: number;
  baseDelayMs?: number;
};

function getStatus(error: unknown): number | undefined {
  const value = error as {
    response?: {
      status?: number;
    };
    status?: number;
  };

  return value.response?.status ?? value.status;
}

function getRetryAfterMs(error: unknown): number | undefined {
  const value = error as {
    response?: {
      headers?: Record<string, unknown>;
    };
  };

  const headers = value.response?.headers;

  if (!headers) {
    return undefined;
  }

  const retryAfter =
    headers["retry-after"] ??
    headers["Retry-After"];

  if (typeof retryAfter !== "string") {
    return undefined;
  }

  const seconds = Number(retryAfter);

  if (!Number.isNaN(seconds)) {
    return seconds * 1000;
  }

  const retryDate = Date.parse(retryAfter);

  if (!Number.isNaN(retryDate)) {
    return Math.max(0, retryDate - Date.now());
  }

  return undefined;
}

function isRetryable(error: unknown): boolean {
  const status = getStatus(error);

  return (
    status === 429 ||
    status === 408 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    status === undefined
  );
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 500;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (
        attempt >= maxRetries ||
        !isRetryable(error)
      ) {
        throw error;
      }

      const retryAfterMs = getRetryAfterMs(error);

      const exponentialDelay =
        baseDelayMs * 2 ** attempt;

      const delay = retryAfterMs ?? exponentialDelay;

      console.error(
        `WooCommerce request failed. Retrying in ${delay}ms ` +
        `(attempt ${attempt + 1}/${maxRetries})`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );

      attempt++;
    }
  }
}