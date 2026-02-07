const token = Buffer.from(`admin:${Date.now() - 25 * 60 * 60 * 1000}`).toString("base64"); // Expired token (25 hours old)
console.log("Expired Token:", token);

const decoded = Buffer.from(token, "base64").toString("utf-8");
const [username, timestamp] = decoded.split(":");
const tokenAge = Date.now() - parseInt(timestamp);
const maxAge = 24 * 60 * 60 * 1000;

console.log("Decoded:", decoded);
console.log("Age:", tokenAge);
console.log("Max Age:", maxAge);
console.log("Valid:", username && timestamp && tokenAge < maxAge);
