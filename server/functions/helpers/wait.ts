export default function wait(ms: number = 1_500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitForCloudFunctionExecution(): Promise<void> {
  return wait(5_000);
}
