import * as path from "path";
import * as fs from "fs";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
const AWS = require('aws-sdk');
const {
  LambdaClient,
  CreateFunctionCommand
} = require("@aws-sdk/client-lambda");
import {getConfig} from "./config";


export function getPackage() {
  let currentDir = process.cwd();
  let packagePath = path.join(currentDir, 'package.json')
  return JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
}

export async function uploadFile(filepath: string): Promise<SendData> {
  const fileContent = fs.readFileSync(filepath);

  // TODO: In the future, this should happen on a server, not
  //       directly to S3
  const nludbConfig = await getConfig();

  // Setting up S3 upload parameters
  const params = {
    Bucket: nludbConfig.AWS_BUCKET,
    Key: path.basename(filepath), // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  const s3 = new AWS.S3({
    accessKeyId: nludbConfig.AWS_ID,
    secretAccessKey: nludbConfig.AWS_SECRET
  });

  return new Promise<SendData>((resolve, reject) => {
    s3.upload(params, function (err: Error, data: SendData) {
      if (err) {
        reject(err)
      }
      resolve(data);
    });
  });
}

export async function createLambdaFunction(fileKey: string, appName: String) {

  const nludbConfig = await getConfig();

  //Set the AWS Region.
  const REGION = nludbConfig.AWS_REGION;

  // Instantiate an AWS Lambda client service object.
  let credentials = {
    accessKeyId: nludbConfig.AWS_ID,
    secretAccessKey: nludbConfig.AWS_SECRET
  }
  const lambda = new LambdaClient({ region: REGION, credentials: credentials });

  // Set the parameters.
  const params = {
    Code: {
      S3Bucket: nludbConfig.AWS_BUCKET, // BUCKET_NAME
      S3Key: fileKey, // ZIP_FILE_NAME
    },
    FunctionName: appName,
    Handler: "app.app_handler",
    Role: nludbConfig.AWS_ROLE,
    Runtime: "python3.9",
    Description: `Lambda function for ${appName}`,
  };

  return await lambda.send(new CreateFunctionCommand(params));

}
