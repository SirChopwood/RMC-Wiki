// @ts-ignore
import {PrototypeConverter} from "./converter.ts";
import chalk from "chalk";

export default class Prototype {
    converter: PrototypeConverter
    name: string
    parents: Array<string>
    id: string
    description: string
    object: any
    components: Map<string, any>

    constructor(converter: PrototypeConverter, yaml: any) {
        this.converter = converter
        this.object = yaml
        this.id = yaml.id
        if (Array.isArray(yaml.parent)) {
            this.parents = yaml.parent
        } else if (yaml.parent) {
            this.parents = [yaml.parent]
        }
        if (yaml.components) {
            this.components = new Map<string, any>(
                yaml.components.map(x => [x.type, x] as [string, any])
            )
        } else {
            this.components = new Map<string, any>()
        }
    }

    async setup() {
        await this.tryGetPrototype(this, "name", async (value: string) => {
            this.name = value
        })
        await this.tryGetPrototype(this, "description", async (value: string) => {
            this.description = value
        })
    }

    // INTERNAL ONLY Recursively search for parent and attempt to find value from them
    private async tryGetPrototype(prototype: Prototype, name: string, callback: (value: any) => Promise<boolean> | Promise<void>) {
        if (Object.keys(prototype.object).includes(name)) {
            await callback(prototype.object[name])
            return true
        }
        if (prototype.parents && prototype.parents.length > 0) {
            for (let parent of prototype.parents) {
                if (this.converter.verbose) console.log(chalk.italic.grey(`Trying Parent ${parent} for ${name}.`))
                if (this.converter.prototypeCache.has(parent)) {
                    let parentProto = this.converter.prototypeCache.get(parent)
                    if (await this.tryGetPrototype(parentProto, name, callback)) {
                        return true
                    }
                }
            }
        }
        return false
    }

    // Recursively search for parent and attempt to find value from them
    async tryGetPrototypeValue(prototype: Prototype, component: string, path: Array<string>, callback: (value: any) => Promise<boolean> | Promise<void>) {
        return prototype.tryGetComponent(component, path, async (value: any) => {
            if (value) {
                await callback(value)
                return true
            }

            if (prototype.parents && prototype.parents.length > 0) {
                for await (let parent of prototype.parents) {
                    if (this.converter.verbose) console.log(chalk.italic.grey(`Trying Parent ${parent} for ${path} in ${component}.`))
                    if (this.converter.prototypeCache.has(parent)) {
                        let parentProto = this.converter.prototypeCache.get(parent)
                        if (await this.tryGetPrototypeValue(parentProto, component, path, callback)) {
                            return true
                        }
                    }
                }
            }
            return false
        })
    }

    tryGetComponentValue(component: string, path: Array<string>, fallback: string) {
        if (!this.components.has(component)) {
            return fallback
        }

        try {
            let result = this.components.get(component)
            for (let prop of path) {
                result = result[prop]
            }
            return result
        } catch (e) {
            console.error(e)
            return fallback
        }
    }

    async tryGetComponent(component: string, variables: Array<string>, callback: (value: any) => Promise<boolean>) {
        if (!this.components.has(component)) {
            await callback(undefined)
            return true
        }

        try {
            let result = this.components.get(component)
            for (let vari of variables) {
                result = result[vari]
            }
            await callback(result)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}