import {Command, flags} from '@oclif/command'
import cli from 'cli-ux';
import * as path from "path";
import * as fs from "fs";
import {createLambdaFunction, getPackage, uploadFile} from "../utils";
import {getConfig} from "../config";
const archiver = require('archiver');


export default class Deploy extends Command {
  static description = 'Deploys and NLUDB application';

  static examples = [
    `$ nludb deploy
App deployed! Try running with \`nludb run\`
`,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    // // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  }

  static args = [];

  async run() {
    const {args, flags} = this.parse(Deploy);

    // Load config for the first time if needed
    await getConfig();

    // Grab the information about the NLUDB app
    cli.action.start('Processing package contents');
    let appPackage = getPackage();
    let currentDir = process.cwd();
    cli.action.stop();

    cli.info(`Deploying ${appPackage.name} v${appPackage.version}`);

    // Zip the file
    cli.action.start('Zipping package');
    const archivesLocation = path.join(currentDir, 'build/archives');
    const zipLocation = path.join(archivesLocation, `${appPackage.name}_v${appPackage.version}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(zipLocation);
    fs.mkdirSync(archivesLocation, {recursive: true});

    await new Promise<void>((resolve, reject) => {
      archive
        .directory(path.join(currentDir, 'src'), false)
        .directory(path.join(currentDir, 'packages'), false)
        .on('error', (err: any) => {reject(err)})
        .pipe(stream)
      ;
      stream.on('close', () => {resolve()});
      archive.finalize();
    })
    cli.action.stop();

    // Uploading package
    cli.action.start('Uploading package');
    await uploadFile(zipLocation);
    cli.action.stop();

    cli.action.start('Deploying new app');
    await createLambdaFunction(path.basename(zipLocation), appPackage.name);
    cli.action.stop();

    cli.info('App deployed! Try running with `nludb run`');
  }
}
