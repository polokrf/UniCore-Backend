import config from "../config"
import redisClient from "./redis";

export const getGrantToken = async () => {
  
  const redisIdTokenKey = 'bkash:id_token'
  const redisRefreshKey = 'bkash:refresh_token'


  
  let redisIdToken = await redisClient.get(redisIdTokenKey)
  const redisIdTokenTtl= await redisClient.ttl(redisIdTokenKey)
  
  const redisRefreshToken = await redisClient.get(redisRefreshKey)
  const redisRefreshTokenTtl = await redisClient.ttl(redisRefreshKey);

  if ((redisIdTokenTtl <= 600 || !redisIdToken) && redisRefreshToken && redisRefreshTokenTtl >= 600) {
    const response = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/token/refresh`,
      {
        method: 'POST',

        headers: {
          Content_Type: 'application/json',
          Accept: 'application/json',
          username: config.bkash_userName,
          password: config.bkash_password,
        },
        body: JSON.stringify({
          app_key: config.bkash_api_key,
          app_secret: config.bkash_api_secret,
          refresh_token:redisRefreshToken
        }),
      },
    );

     if (!response.ok) {
       throw new Error('bkash grant token not generate');
     }
   
    const refResult = await response.json();

    await redisClient.set(redisIdTokenKey, refResult.id_token, {
      expiration: {
        type: 'EX',
        value: 60 * 60,
      },
    });

    


    redisIdToken = refResult.id_token;

    return redisIdToken;


  }
  

  if (redisIdTokenTtl > 600) {
    return redisIdToken
  }

  const res = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/token/grant`,
    {
      method: 'POST',
      headers: {
        Content_Type: 'application/json',
        Accept: 'application/json',
        username: config.bkash_userName,
        password: config.bkash_password,
      },
      body: JSON.stringify({
        app_key: config.bkash_api_key,
        app_secret: config.bkash_api_secret,
      }),
    },
  );

  // console.log(res)
  if (!res.ok) {
    throw new Error('bkash grant token not generate')
  }

  const result = await res.json()

  await redisClient.set(redisIdTokenKey, result.id_token, {
    expiration: {
      type: 'EX',
      value: 60 * 60
     }
  })
  
  await redisClient.set(redisRefreshKey, result.refresh_token, {
    expiration: {
      type: 'EX',
      value: 60 * 60 * 24 * 28,
    },
  });

  redisIdToken = result.id_token

  return redisIdToken

  
}