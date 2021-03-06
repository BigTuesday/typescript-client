import { readFileSync } from "fs"
import chalk from 'chalk'

export enum PackageType {
  Jupyter,
  Python,
  Typescript,
  React,
  Unknown
}

export function getPackageType(rootPath: string): PackageType {
  let packageJson: any = null;
  try {
    let rawFile = readFileSync(`${rootPath}/package.json`, 'utf-8')
    packageJson = JSON.parse(rawFile);
  } catch {
    console.error(`${chalk.red('Error. ')} Unable to read package.json from new project: ${rootPath}/package.json`)
    return PackageType.Unknown
  }

  if (packageJson == null) {
    console.error(`${chalk.red('Error. ')} Unable to read package.json from new project: ${rootPath}/package.json`)
    return PackageType.Unknown
  }

  if (typeof packageJson.nludb == 'undefined') {
    console.error(`${chalk.red('Error. ')} Example project's package.json did not include an 'nludb' setting block.`)
    return PackageType.Unknown
  }

  if (typeof packageJson.nludb.packageType == 'string') {
    console.error(`${chalk.red('Error. ')} Example project's package.json did not include a 'packageType' string parameter in the 'nludb' setting block.`)
    return PackageType.Unknown
  }

  switch ((packageJson.nludb.packageType as string).toLowerCase()) {
    case 'jupyter':
    return PackageType.Jupyter
    case 'python':
    return PackageType.Python
    case 'typescript':
    return PackageType.Typescript
    case 'react':
    return PackageType.React
    default:
    return PackageType.Unknown
  }

}

function displayPostInstallInstructionsJupyter() {
  console.log("jupyter-notebook")
}


function displayPostInstallInstructionsUnknown() {
  // console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`)
  // console.log('Inside that directory, you can run several commands:')
  // console.log()
  // console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}dev`))
  // console.log('    Starts the development server.')
  // console.log()
  // console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`))
  // console.log('    Builds the app for production.')
  // console.log()
  // console.log(chalk.cyan(`  ${displayedCommand} start`))
  // console.log('    Runs the built app in production mode.')
  // console.log()
  // console.log('We suggest that you begin by typing:')
  // console.log()
  // console.log(chalk.cyan('  cd'), cdpath)
  // console.log(
  //   `  ${chalk.cyan(`${displayedCommand} ${useYarn ? '' : 'run '}dev`)}`
  // )
  // console.log()
}

export function displayPostInstallInstructions(appName: string, appPath: string, packageType: PackageType) {
  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`)

  switch (packageType) {
    case PackageType.Jupyter:
      displayPostInstallInstructionsJupyter()
    default:
      displayPostInstallInstructionsUnknown()
  }
  console.log()
}
