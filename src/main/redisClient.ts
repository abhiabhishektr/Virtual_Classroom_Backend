import { createClient } from 'redis';

// Function to decode base64 strings
const decodeBase64 = (str: string): string => Buffer.from(str, 'base64').toString('utf-8');

// Decode environment variables, with fallback to defaults
const redisHost: string = process.env.REDIS_HOST ? decodeBase64(process.env.REDIS_HOST) : 'localhost';
console.log("redisHost: ", redisHost);

const redisPort: number = process.env.REDIS_PORT ? Number(decodeBase64(process.env.REDIS_PORT)) : 6379;
console.log("redisPort: ", redisPort);

// Create a Redis client instance
const redisClient = createClient({
  socket: {
    host: "localhost", // Redis server host
    port: 6379, // Redis server port
  }
});

// Handle errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Immediately try to connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.error('Could not connect to Redis:', err);
    // Optionally implement retry
    setTimeout(() => {
      redisClient.connect();
    }, 5000);
  }
})();

export { redisClient };



// redis-cli KEYS *


// $keys = redis-cli KEYS *
// foreach ($key in $keys) {
//     $value = redis-cli GET $key
//     Write-Output "$key -> $value"
// }
