// backend/src/main/redisClient.ts
import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost', // Redis server host
    port: 6379, // Redis server port
  }
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export { redisClient };


// redis-cli KEYS *


// $keys = redis-cli KEYS *
// foreach ($key in $keys) {
//     $value = redis-cli GET $key
//     Write-Output "$key -> $value"
// }
