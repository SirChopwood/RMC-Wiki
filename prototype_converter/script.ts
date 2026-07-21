import * as path from 'path';
import * as fs from "node:fs";
// @ts-ignore
import {PrototypeConverter} from "./converter.ts";
import chalk from "chalk";

// @ts-ignore
const __dirname = import.meta.dirname
const resourcesDir = path.join(__dirname, "../RMC14/Resources")
const converterDir = path.join(__dirname, "converters")
const contentDir = path.join(__dirname, "../content")

run(false)
    .then(r => console.log(chalk.yellowBright.bold("=== Processor Complete! ===")))
    .catch(e => console.error(e))

async function run(verbose: boolean): Promise<void> {
    if (verbose) console.log(__dirname, resourcesDir, converterDir, contentDir)
    if (!fs.existsSync(resourcesDir)) {
        console.log("Unable to find RMC-14 Resources directory")
    }
    if (!fs.existsSync(converterDir)) {
        console.log("Unable to find prototype converter directory")
    }

    for (let fileName of fs.readdirSync(converterDir).filter(file => file.endsWith(".ts"))) {
        console.log(chalk.yellowBright.bold(`=== Running Converter ${fileName} ===`))
        let {default: file} = await import(path.join("file://", converterDir, fileName))
        let newClass = await new file(verbose, resourcesDir, contentDir) as PrototypeConverter
        await newClass.setup()
        await newClass.run()
    }
}
