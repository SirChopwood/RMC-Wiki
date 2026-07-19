import * as path from 'path';
import * as fs from "node:fs";
import * as YAML from 'yaml'

export class PrototypeConverter {
    prototypesDir: string
    contentDir: string

    constructor(prototypesDir: string, contentDir: string) {
        this.prototypesDir = prototypesDir
        this.contentDir = contentDir
    }

    // Call to process every prototype in a directory
    protected async convertProtoDir(target: string) {
        let dirString = ""
        for await (let protoFilePath of this.getDirProtoFiles(target)) {
            console.log(`Processing ${protoFilePath}`)
            try {
                const file = fs.readFileSync(protoFilePath, 'utf8')
                const data = YAML.parse(file, {strict: false}) as Array<any>
                console.log(data.length)
                dirString += await this.processProtoFile(data)
            } catch (error) {
                console.error(error)
            }
        }
        return dirString
    }

    // Call to get every prototype in a directory
    protected getDirProtoFiles(target: string) {
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
    async processProtoFile(fileData: object): Promise<string> {
        return ""
    }
}