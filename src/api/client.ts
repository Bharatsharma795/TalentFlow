// src/api/client.ts

// Generic API fetch helper with simulated delay and error rate.
// This function is useful for mocking realistic network behavior in development.

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  errorRate = 0.1,
  minDelay = 200,
  maxDelay = 1200
): Promise<T> {

  // Simulate random network delay
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  // Simulate random failure based on errorRate
  const shouldFail = Math.random() < errorRate;

  // Wait for simulated delay
  await new Promise((res) => setTimeout(res, delay));

  // Randomly throw a simulated network error
  if (shouldFail) {
    throw new Error("Network Error: Simulated failure");
  }

  // Perform the actual API call
  const response = await fetch(url, options);

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return parsed JSON response
  return response.json();
}
