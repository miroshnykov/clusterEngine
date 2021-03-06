import fs from "fs";
import AWS from 'aws-sdk'
import consola from "consola";
import {getFileSize} from "../Utils/file";
import {redis} from "../redis";
import * as dotenv from "dotenv";

dotenv.config();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const tempFileName = process.env.CAMPAIGNS_RECIPE_PATH || ''
export const getCampaignsFileFromBucket = async () => {
  try {
    let s3Key = process.env.S3_CAMPAIGNS_RECIPE_PATH || ''
    let s3BucketName = process.env.S3_BUCKET_NAME || ''
    let params = {Bucket: s3BucketName, Key: s3Key}
    const s3Stream = s3.getObject(params!).createReadStream();
    s3Stream.on('error', (err) => {
      consola.error(err);
    });

    const tempFileDownload = fs.createWriteStream(tempFileName);

    s3Stream.pipe(tempFileDownload)
      .on('error', (err) => {
        consola.error('File Stream:', err);
      })
      .on('close', () => {
        getFileSize(tempFileName).then(async size => {
          consola.success(`file size ${tempFileName} is { ${size} }`);
          await redis.set(`campaignsSize_`, size!)
        })
        consola.success(`file ${tempFileName} was uploaded correctly.`);

      });

  } catch (error) {
    console.error('s3 error:', error)
  } finally {

  }

}

