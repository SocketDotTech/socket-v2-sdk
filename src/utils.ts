/**
 * Async sleep for a duration.
 * @param millis Number of millisedconds to sleep
 * @returns When the sleep time is finished
 */
export async function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
