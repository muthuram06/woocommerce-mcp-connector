import { describe, expect, it, vi } from "vitest";
import { withRetry } from "../src/rateLimit/retry.js";

describe("withRetry", () => {
  it("returns successfully when the operation succeeds", async () => {
    const operation = vi.fn().mockResolvedValue("success");

    const result = await withRetry(operation);

    expect(result).toBe("success");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("retries after a 429 response", async () => {
    const error = {
      response: {
        status: 429
      }
    };

    const operation = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce("success");

    const result = await withRetry(operation, {
      maxRetries: 1,
      baseDelayMs: 1
    });

    expect(result).toBe("success");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("stops after the retry limit", async () => {
    const error = {
      response: {
        status: 503
      }
    };

    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(operation, {
        maxRetries: 2,
        baseDelayMs: 1
      })
    ).rejects.toEqual(error);

    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("does not retry non-transient errors", async () => {
    const error = {
      response: {
        status: 401
      }
    };

    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(operation)
    ).rejects.toEqual(error);

    expect(operation).toHaveBeenCalledTimes(1);
  });
});