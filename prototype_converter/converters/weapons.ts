import * as path from 'path';
import * as fs from "node:fs";
// @ts-ignore
import {PrototypeConverter} from "../converter.ts";
// @ts-ignore
import Prototype from "../prototype.ts";
import chalk from "chalk";

export default class WeaponsPrototypeConverter extends PrototypeConverter {
    weaponTypeParents = [
        "CMBaseWeaponRifle",
        "RMCBaseWeaponRifleNoMagazineProvider",
        "CMWeaponPistolBase",
        "RMCBaseWeaponGrenadeLauncher",
        "RMCBaseWeaponLauncher",
        "CMBaseWeaponGun",
        "RMCBaseWeaponLMG",
        "RMCWeaponRevolverBase",
        "RMCBaseBreechloader",
        "RMCBaseWeaponShotgun",
        "RMCSmartGunNoCamo",
        "RMCSmartGun",
        "CMBaseWeaponSMG",
        "RMCBaseWeaponSniperRifle"
    ]
    weaponCategories = [
        "BoltAction",
        "Flamethrowers",
        "HMGs",
        "Launchers",
        "LMGs",
        "Pistols",
        "Revolvers",
        "Rifles",
        "Shotguns",
        "SmartGuns",
        "SMGs",
        "Snipers"
    ]

    async run(): Promise<void> {
        await this.addDirectoriesToCache(["_RMC14/Entities/Objects/Weapons"])

        for await (const wepCat of this.weaponCategories) {
            fs.writeFileSync(
                path.join(this.contentDir, "weapons", `${wepCat.toLowerCase()}.md`),
                await this.convertDirectories([`_RMC14/Entities/Objects/Weapons/Guns/${wepCat}`])
            )
        }
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
            attachments: {} as Record<string, Array<string>>,
            magazines: [] as Array<{
                name: string,
                id: string
                icon: string,
                color?: string,
                capacity?: number,
                damage?: number,
                ap?: number,
            }>,
            lore: ""}

        let attachments: Record<string, Array<string>> = {}
        if (prototype.components.has("AttachableHolder")) {
            for (let slotName of Object.keys(prototype.components.get("AttachableHolder").slots)) {
                const slotNameFormatted = slotName.replace("rmc-aslot-", "")
                attachments[slotNameFormatted] = prototype.components.get("AttachableHolder").slots[slotName].whitelist.tags
            }
        }

        let stats: Record<string, string> = {}
        await prototype.tryGetPrototypeValue(prototype, "RMCSelectiveFire", ["baseFireModes"], async (value) => {
            stats["fireMode"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCWeaponAccuracy", ["accuracyMultiplier"], async (value) => {
            stats["accuracyWielded"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCWeaponAccuracy", ["accuracyMultiplierUnwielded"], async (value) => {
            stats["accuracyUnWielded"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCSelectiveFire", ["baseFireRate"], async (value) => {
            stats["fireRate"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCSelectiveFire", ["recoilUnwielded"], async (value) => {
            stats["recoil"] = value
        })

        formattedData.magazines = [
            {
                name: "M54C magazine (10x24mm)",
                id: "CMMagazineRifleM54C",
                icon: "_RMC14/Objects/Weapons/Guns/Ammunition/Magazines/m54c.rsi",
                capacity: 40,
                damage: 40,
                ap: 5
            },
            {
                name: "M54C AP magazine (10x24mm)",
                id: "CMMagazineRifleM54CAP",
                icon: "_RMC14/Objects/Weapons/Guns/Ammunition/Magazines/m54c.rsi",
                color: "#1F951F",
                capacity: 40,
                damage: 30,
                ap: 40
            },
            {
                name: "M54C extended magazine (10x24mm)",
                id: "CMMagazineRifleM54CExt",
                icon: "_RMC14/Objects/Weapons/Guns/Ammunition/Magazines/m54ce.rsi",
                capacity: 60,
                damage: 40,
                ap: 5
            }
        ]

        // If this specific item doesnt have lore, dont get from parents
        formattedData.lore = prototype.tryGetComponentValue("RMCLoreExaminable", ["content"], "")

        formattedData.sprite = ["Effects/crayondecals.rsi/questionmark.png"]
        await prototype.tryGetPrototypeValue(prototype, "Sprite", [], async (value) => {
            if (value.layers && value.layers.length > 0) {
                formattedData.sprite = []
                for (const layer of value.layers) {
                    if (layer.sprite) {
                        formattedData.sprite.push(`${layer.sprite}/${layer.state}.png`)
                    } else {
                        formattedData.sprite.push(`${value.sprite}/${layer.state}.png`)
                    }
                }
            } else if (value.sprite && value.state) {
                formattedData.sprite = [`${value.sprite}/${value.state}.png`]
            }
        })
        if (this.verbose) console.log(`- ${chalk.green(prototype.id)} "${prototype.name}"`)
        return `
## ${formattedData.displayName}
:weapon-profile{:sprite='${JSON.stringify(formattedData.sprite)}'}
:hatnote{icon=false}[ID: ${formattedData.id}]
:pull-quote[${formattedData.description}]
:weapon-stats{:stats='${JSON.stringify(formattedData.stats)}'}
:weapon-attachments{:attachments='${JSON.stringify(formattedData.attachments)}'}
:weapon-ammunition{:magazines='${JSON.stringify(formattedData.magazines)}'}
${formattedData.lore ? `:collapsible{title="Show Lore"}[${formattedData.lore}]` : ""}
---
\n<br><br><br><br><br><br><br><br>\n
`
    }
}

