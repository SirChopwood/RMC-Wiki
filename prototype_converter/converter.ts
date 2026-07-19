import * as path from 'path';
import * as fs from "node:fs";
import * as YAML from 'yaml'
// @ts-ignore
import Prototype from "./prototype.ts";

export class PrototypeConverter {
    prototypesDir: string
    contentDir: string
    prototypes: Map<string, Prototype> = new Map()

    constructor(prototypesDir: string, contentDir: string) {
        this.prototypesDir = prototypesDir
        this.contentDir = contentDir
    }

    // Call to process every prototype in a directory
    protected async convertPrototypesInDirectory(target: string, clearCache = true) {
        if (clearCache) {this.prototypes = new Map()}
        for await (let protoFilePath of this.getPrototypesInDirectory(target)) {
            console.log(`Processing ${protoFilePath}`)
            try {
                const file = fs.readFileSync(protoFilePath, 'utf8')
                const data = YAML.parse(file, {strict: false}) as Array<any>
                for (const proto of data) {
                    if (proto.type !== "entity") continue
                    let newProto = new Prototype(proto)
                    this.prototypes.set(newProto.id, newProto)
                }
            } catch (error) {
                console.error(error)
                console.log("...Error!")
            }
            console.log("...Done!")
        }
        let dirString = ""
        for await (let proto of this.prototypes.values()) {
            console.log(`Converting ${proto.id} "${proto.name}"`)
            try {
                dirString += await this.convertPrototype(proto)
            } catch (error) {
                console.error(error)
                console.log("...Error!")
            }
        }
        console.log("...Done!")
        return dirString
    }

    // Call to get every prototype in a directory
    protected getPrototypesInDirectory(target: string) {
        let fullPath = path.join(this.prototypesDir, target)
        if (!fs.existsSync(fullPath)) {
            console.log(`Unable to find RMC-14 Prototypes directory: ${path}`)
        }
        const isFile = fileName => {
            return fs.lstatSync(fileName).isFile();
        };

        return fs.readdirSync(fullPath, {recursive: true})
            .map(fileName => {
                return path.join(fullPath, fileName);
            })
            .filter(isFile);
    }

    // Override to control how the converter generally functions
    async run() {
    }

    // Override to control how that specific file is handled
    async convertPrototype(prototype: Prototype): Promise<string> {
        return ""
    }
}