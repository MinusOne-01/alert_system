export async function sendPush({ tokens, payload }) {
  // For now: simulate
  console.log("Sending push to tokens:", tokens);
  console.log("Payload:", payload);

  // Simulate occasional failure
  if (tokens.length === 0) {
    throw new Error("No devices registered");
  }

  return true;
}
