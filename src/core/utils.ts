export async function silent(cb: () => void | Promise<void>) {
  const log = console.log;
  console.log = () => {};
  await cb();
  console.log = log;
}
