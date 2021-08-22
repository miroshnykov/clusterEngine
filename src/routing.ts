import {Request, Response} from 'express';
import {redis} from './redis';
import fs from "fs";
import JSONStream from "JSONStream"
import zlib from "zlib";

export const offer = async (req: Request, res: Response): Promise<Response> => {
  let data = await redis.get('fileSizeInfo')
  // let gunzip = zlib.createGunzip();
  // let file = '/tmp/recipe_/offer-1629473210.json.gz'
  // let stream = fs.createReadStream(file)
  // let jsonStream = JSONStream.parse('*')
  // stream.pipe(gunzip).pipe(jsonStream)
  // console.log(` \n  *** Set offers to Local Redis *** Size redis:`  )
  // jsonStream.on('data', async (item:any) => {
  //     if (!item.offerId) {
  //         return
  //     }
  //     console.log(`Set offerNew to redis offerId:${item.offerId}`)
  //     await redis.set(`offerNew-${item.offerId}`, JSON.stringify(item))
  //
  // })

  return res.json({success: true, data: data});
};
