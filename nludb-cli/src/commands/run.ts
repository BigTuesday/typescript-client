import axios from 'axios';
import {Command, flags} from '@oclif/command'
import cli from 'cli-ux';
import {getPackage} from '../utils';
import * as path from "path";
import {getConfig} from "../config";
import * as fs from "fs";

export default class Run extends Command {
  static description = 'Runs an NLUDB app'

  static examples = [
    `$ nludb run --input input1.json
{ result: 'Hello, NLUDB' }
`,
    `$ nludb run --data "{\\"name\\": \\"NLUDB\\"}"
{ result: 'Hello, NLUDB' }
`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    data: flags.string({char: 'd', description: 'Data to send to the app (JSON)'}),
    input: flags.string({char: 'i', description: 'Input file to use as data input for an app'})
    // // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(Run)

    // Grab the information about the NLUDB app
    cli.action.start('Running function')
    let appPackage = getPackage();
    let name = appPackage['name'];
    let url = (await getConfig()).LAMBDA_ENDPOINT + name;
    let body = {
      data: flags.data ? JSON.parse(flags.data) : {}
    }
    if (flags.input) {
      let inputFile = fs.readFileSync(path.join(process.cwd(), 'inputs', flags.input), 'utf-8');
      body.data = JSON.parse(inputFile);
    }

    axios.post(url, body).then((resp) => {
      cli.action.stop();
      console.log(resp.data)
    }).catch((err) => {
      cli.action.stop();
      console.error(err.data)
    });

  }
}
