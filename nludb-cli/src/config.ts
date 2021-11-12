import * as path from "path";
import * as fs from "fs";
import cli from "cli-ux";

const HOME_DIR = require('os').homedir();

type NLUDBConfig = {
  AWS_ID: string;
  AWS_SECRET: string;
  AWS_BUCKET: string;
  AWS_REGION: string;
  AWS_ROLE: string;
  LAMBDA_ENDPOINT: string;
}

const NLUDB_CONFIG_FILENAME = '.nludb'

let NLUDB_CONFIG: NLUDBConfig | null = null;

/**
 * Loads the NLUDB config to a global variable that can be
 * accessed elsewhere.
 */
export async function getConfig(): Promise<NLUDBConfig> {
  if (NLUDB_CONFIG) {
    return NLUDB_CONFIG;
  }
  let configLocation = path.join(HOME_DIR, NLUDB_CONFIG_FILENAME)
  if (!fs.existsSync(configLocation)) {
    await startConfigFlow()
  }
  NLUDB_CONFIG = JSON.parse(fs.readFileSync(configLocation, 'utf-8')) as NLUDBConfig
  return NLUDB_CONFIG;
}

export function saveConfig(config: NLUDBConfig) {
  let configLocation = path.join(HOME_DIR, NLUDB_CONFIG_FILENAME);
  fs.writeFileSync(configLocation, JSON.stringify(config));
}

export async function startConfigFlow(): Promise<NLUDBConfig> {
  cli.info("Please enter your NLUDB credentials");
  cli.info("WARNING: This is for NLUDB developers only");
  let AWS_ID = await cli.prompt("AWS ID");
  let AWS_SECRET = await cli.prompt("AWS Secret ID");
  let AWS_BUCKET = await cli.prompt("AWS App Bucket");
  let AWS_REGION = await cli.prompt("AWS Region");
  let AWS_ROLE = await cli.prompt("AWS Role");
  let LAMBDA_ENDPOINT = await cli.prompt("LAMBDA_ENDPOINT");
  let config = {AWS_ID, AWS_SECRET, AWS_BUCKET, AWS_REGION, AWS_ROLE, LAMBDA_ENDPOINT};
  saveConfig(config);
  return config;
}
