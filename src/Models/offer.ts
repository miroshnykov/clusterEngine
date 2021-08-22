import {redis} from "../redis";

export const getOffer = async (id: number) => {
  try {
    return await redis.get(`offerNew-${id}`)
  } catch (e) {
    console.log('Get offer Model error:', e)
  }
};