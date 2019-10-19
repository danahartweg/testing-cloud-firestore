export default function wait(ms: number = 3_000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
