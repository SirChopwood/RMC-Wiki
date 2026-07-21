import * as path from 'path';
// @ts-ignore
import {PrototypeConverter} from "../converter.ts";
import chalk from "chalk";
import * as fsp from "node:fs/promises";
import * as fs from "node:fs";

export default class Locale {
    converter: PrototypeConverter
    language: string
    path: string
    contents: Map<string, string> = new Map()
    private previousLine = ""

    constructor(converter: PrototypeConverter, resourcesDir: string, language: string, dir: string) {
        this.converter = converter
        this.language = language
        this.path = path.join(resourcesDir, "Locale", language, dir)
    }

    async setup() {
        let count = 0
        console.log(chalk.bold.blueBright(`Adding Locale files from: ${this.path}`))
        for await (let filePath of await this.getAllFtlFiles()) {
            if (this.converter.verbose) console.log(`${chalk.bold.grey(filePath)}`)
            try {
                let file = await fsp.open(filePath)
                for await (let line of file.readLines()) {
                    if (line !== "") {
                        await this.addLocaleToCache(line)
                        count++
                    }
                }
                this.previousLine = ""
            } catch (error) {
                if (this.converter.verbose) console.error(error)
            }
        }
        console.log(chalk.bold.green(`Added ${count} Locales to the Cache!`))
    }

    protected async getAllFtlFiles() {
        let files = []
        if (!fs.existsSync(this.path)) {
            console.log(chalk.bgRedBright.white(`Unable to find Locale directory: ${path}`))
        }
        files = files.concat(fs.readdirSync(this.path, {recursive: true})
            .map((fileName) => {
                return path.join(this.path, fileName);
            })
            .filter((fileName) => {
                return fs.lstatSync(fileName).isFile();
            }))
        return files
    }

    // Create new Prototype Class and add it to the cache
    protected async addLocaleToCache(data: string) {
        let cleanData = data.replace(/^[\w.]+$/i, "").trim()
        let locale = cleanData.split(" = ")

        // Add new locale string
        if (locale && locale[0] && locale[1]) {
            this.contents.set(locale[0], locale[1])
            this.previousLine = locale[0]
            if (this.converter.verbose) console.log(`- ${chalk.cyan(locale[0])} "${locale[1]}"`)
            return
        }
        // Update existing locale string
        if (cleanData && cleanData.length > 0 && this.previousLine) {
            let previousText = this.contents.get(this.previousLine)
            let newText = `${previousText}\n${cleanData}`
            this.contents.set(this.previousLine, newText)
            if (this.converter.verbose) console.log(`- ${chalk.cyan(previousText)} "${newText}"`)
            return
        }
        if (this.converter.verbose) console.log(`- ${chalk.red(data)}`)
        return
    }

    getLocaleString(target: string) {
        return this.contents.get(target)
    }
}