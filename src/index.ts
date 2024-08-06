import Fastify from 'fastify';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import fastifyPostgres from '@fastify/postgres';

dotenv.config();

const fastify = Fastify();
const cache = new NodeCache({ stdTTL: 600 }); // Caching 10 mins

// Connecting DB
fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL, // URL for connecting postgres db
  });
  

//First endpoint
fastify.get('/items', async (request, reply) => {
  const app_id: number = 730; 
  const currency: string = 'EUR';

  const cacheKey: string = `items_${app_id}_${currency}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`https://api.skinport.com/v1/items`, {
      params: { app_id, currency },
    });

    const items = response.data.map((item: any) => ({
      ...item,
      min_price_tradable: item.min_price,
      min_price_non_tradable: item.min_price,
    }));

    cache.set(cacheKey, items);
    return items;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to fetch items from Skinport' });
  }
});

//Second endpoint
fastify.post('/purchase', async (request, reply): Promise<{success: boolean, newBalance: number}> => {
    const { userId, amount } = request.body as {userId: number, amount: number};
  
    try {
      const client = await fastify.pg.connect(); 
      const { rows } = await client.query('SELECT balance FROM users WHERE id = $1', [userId]);
  
      if (rows.length === 0) {
        client.release();
        return reply.status(404).send({ error: 'User not found' });
      }
  
      const userBalance = parseFloat(rows[0].balance);
  
      if (userBalance < amount) {
        client.release();
        return reply.status(400).send({ error: 'Insufficient balance' });
      }
  
      await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
      client.release();
  
      return { success: true, newBalance: userBalance - amount };
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to process purchase' });
    }
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
