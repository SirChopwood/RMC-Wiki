import * as path from 'path';
import * as fs from "node:fs";
// @ts-ignore
import {PrototypeConverter} from "./converter.ts";

// @ts-ignore
const __dirname = import.meta.dirname
const prototypesDir = path.join(__dirname, "../RMC14/Resources/Prototypes")
const converterDir = path.join(__dirname, "converters")
const contentDir = path.join(__dirname, "../content")
console.log(__dirname, prototypesDir, converterDir, contentDir)

run()
    .then(r => console.log("Processor Complete!"))
    .catch(e => console.error(e))

async function run(): Promise<void> {
    if (!fs.existsSync(prototypesDir)) {
        console.log("Unable to find RMC-14 Prototypes directory")
    }
    if (!fs.existsSync(converterDir)) {
        console.log("Unable to find prototype converter directory")
    }

    for (let fileName of fs.readdirSync(converterDir).filter(file => file.endsWith(".ts"))) {
        console.log(`Running Converter ${fileName}`)
        let {default: file} = await import(path.join("file://", converterDir, fileName))
        let newClass = await new file(prototypesDir, contentDir) as PrototypeConverter
        await newClass.run()
    }
}
