import * as path from 'path';
import * as fs from "node:fs";
// @ts-ignore
import {PrototypeConverter} from "../converter.ts";
// @ts-ignore
import Prototype from "../robustClasses/prototype.ts";
import chalk from "chalk";

export default class WeaponsPrototypeConverter extends PrototypeConverter {
    weaponTypeParents = [
        "RMCBaseMeleeWeapon"
    ]

    async run(): Promise<void> {
        await this.addDirectoriesToCache(["_RMC14/Entities/Objects/Weapons"])

        fs.writeFileSync(
            path.join(this.contentDir, "equipment", `melee-weapons.md`),
            await this.convertDirectories([`_RMC14/Entities/Objects/Weapons/Melee`])
        )
    }

    override async convertPrototype(prototype: Prototype) {
        let parentMatch = false
        if (Array.isArray(prototype.parents)) {
            for (const parent of prototype.parents) {
                if (this.weaponTypeParents.includes(parent) && !prototype.object.abstract) {
                    parentMatch = true
                }
            }
        } else {
            if (this.weaponTypeParents.includes(prototype.parents) && !prototype.object.abstract) {
                parentMatch = true
            }
        }
        if (!parentMatch) {
            return ""
        }

        let formattedData = {
            displayName: prototype.name || "Undefined Prototype",
            sprite: [] as Array<string>,
            id: prototype.id || "Undefined Prototype",
            description: prototype.description || "No Description Given",
            stats: {} as Record<string, string>,
            lore: ""}

        await prototype.tryGetPrototypeValue(prototype, "MeleeWeapon", ["damage", "types"], async (value) => {
            formattedData.stats["damage"] = value
        })

        await prototype.tryGetPrototypeValue(prototype, "RMCLoreExaminable", ["content"], async (value) => {
            // @ts-ignore
            formattedData.lore = this.getLocaleString(value).replaceAll("\n", "<br>")
        })

        formattedData.sprite = await prototype.getSprite()
        if (this.verbose) console.log(`- ${chalk.green(prototype.id)} "${prototype.name}"`)
        return `
## ${formattedData.displayName}
:weapon-profile{:sprite='${JSON.stringify(formattedData.sprite)}'}
:hatnote{icon=false}[ID: ${formattedData.id}]
:pull-quote[${formattedData.description}]
:weapon-stats{:stats='${JSON.stringify(formattedData.stats)}'}
${formattedData.lore ? `:collapsible{title="Show Lore"}[${formattedData.lore}]` : ""}
---
\n<br><br><br><br><br><br><br><br>\n
`
    }
}

