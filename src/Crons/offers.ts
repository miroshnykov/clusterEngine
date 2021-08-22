import zlib from "zlib";
import fs from "fs";
import JSONStream from "JSONStream";
import {redis} from "../redis";

export const setOffersToRedis = async () => {

  try {
    let gunzip = zlib.createGunzip();
    let file = '/tmp/recipe_/offer-1629473210.json.gz'
    let stream = fs.createReadStream(file)
    let jsonStream = JSONStream.parse('*')
    stream.pipe(gunzip).pipe(jsonStream)
    console.log(` \n  *** Set offers to Local Redis *** Size redis:`)
    jsonStream.on('data', async (item: any) => {
      if (!item.offerId) {
        return
      }
      console.log(`Set offerNew to redis offerId:${item.offerId}`)
      await redis.set(`offerNew-${item.offerId}`, JSON.stringify(item))

    })


  } catch (e) {
    console.info('setOffersToRedisError:', e)
  }

}
