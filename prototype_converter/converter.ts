import * as path from 'path';
import * as fs from "node:fs";
import * as YAML from 'yaml'
// @ts-ignore
import Prototype from "./prototype.ts";
import chalk from 'chalk';

export class PrototypeConverter {
    verbose: boolean
    prototypesDir: string
    contentDir: string
    prototypeCache: Map<string, Prototype> = new Map()

    constructor(verbose: boolean, prototypesDir: string, contentDir: string) {
        this.verbose = verbose
        this.prototypesDir = prototypesDir
        this.contentDir = contentDir
    }

    // Create new Prototype Class and add it to the cache
    protected async addPrototypeToCache(data: any) {
        let newProto = new Prototype(this, data)
        await newProto.setup()
        if (this.verbose) console.log(`- ${chalk.bold.yellow(newProto.id)} "${newProto.name}"`)
        this.prototypeCache.set(newProto.id, newProto)
    }

    // Add the given directories to the Prototype Cache
    protected async addDirectoriesToCache(directories: Array<string>) {
        let count = 0
        console.log(chalk.bold.magenta(`Adding Directories: ${directories}`))
        for await (let filePath of await this.getFilesInDirectory(directories)) {
            if (this.verbose) console.log(`${chalk.bold.grey(filePath)}`)
            try {
                const file = fs.readFileSync(filePath, 'utf8')
                const data = YAML.parse(file, {strict: false}) as Array<any>
                for (const proto of data) {
                    if (proto.type !== "entity" || !proto.id) continue
                    await this.addPrototypeToCache(proto)
                    count++
                }
            } catch (error) {
                //console.error(error)
            }
            //console.log("...Done!")
        }
        console.log(chalk.bold.greenBright(`Added ${count} Prototypes to the Cache!`))
    }

    // Get every file recursively in a prototype folder
    protected async getFilesInDirectory(directories: Array<string>) {
        let files = []
        for await (let dirPath of directories) {
            let fullPath = path.join(this.prototypesDir, dirPath)
            if (!fs.existsSync(fullPath)) {
                console.log(`Unable to find Prototypes directory: ${path}`)
            }
            files = files.concat(fs.readdirSync(fullPath, {recursive: true})
                .map((fileName) => {
                    return path.join(fullPath, fileName);
                })
                .filter((fileName) => {
                    return fs.lstatSync(fileName).isFile();
                }))
        }
        return files
    }

    // Get all the prototypes in a given folder and run the convert function on them
    protected async convertDirectories(directories: Array<string>) {
        console.log(chalk.bold.magenta(`Converting Directories: ${directories}`))
        let result = ""
        let count = 0
        for await (let filePath of await this.getFilesInDirectory(directories)) {
            if (this.verbose) console.log(`${chalk.grey(filePath)}`)
            try {
                const file = fs.readFileSync(filePath, 'utf8')
                const data = YAML.parse(file, {strict: false}) as Array<any>
                for (const proto of data) {
                    if (proto.type !== "entity") continue
                    if (!this.prototypeCache.has(proto.id)) {
                        console.log(chalk.bgRedBright.white(`Entity ${proto.id} not cached!`))
                    }
                    let prototype = this.prototypeCache.get(proto.id)
                    let newString = await this.convertPrototype(prototype)
                    if (newString !== "") {
                        result += newString
                        count++
                    }
                }
            } catch (error) {
                //console.error(error)
            }
            //console.log("...Done!")
        }
        console.log(chalk.bold.greenBright(`Converted ${count} Prototypes!`))
        return result
    }

    // Override to control how the converter generally functions
    async run() {
    }

    // Override to control how that specific file is handled
    async convertPrototype(prototype: Prototype): Promise<string> {
        return ""
    }
}