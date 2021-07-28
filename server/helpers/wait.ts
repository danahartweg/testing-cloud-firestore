const IS_CI = process.env.CI === 'true';

export function wait(ms = 1_500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitForCloudFunctionExecution(): Promise<void> {
  // CI environments typically take longer to execute cloud functions
  return wait(IS_CI ? 2_500 : 1_500);
}
