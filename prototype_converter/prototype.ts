export default class Prototype {
    name: string
    parents: string | Array<string>
    id: string
    description: string
    object: any
    components: Map<string, any>

    constructor(yaml: any) {
        this.name = yaml.name
        this.parents = yaml.parent
        this.id = yaml.id
        this.description = yaml.description
        this.object = yaml
        this.components = new Map<string, any>(
            yaml.components.map(x => [x.type, x] as [string, any])
        )

        console.log(`Imported Prototype ${this.id} "${this.name}"`)
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

    tryGetComponent(component: string, variables: Array<string>, callback: (value: any) => void) {
        if (!this.components.has(component)) {
            return
        }

        try {
            let result = this.components.get(component)
            for (let vari of variables) {
                result = result[vari]
            }
            if (result) {
                callback(result)
            }
            return
        } catch (e) {
            console.error(e)
            return
        }
    }
}