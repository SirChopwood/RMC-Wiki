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
            attachments: {} as Record<string, Array<{
                id: string,
                name: string,
                description: string,
                sprite: Array<string>,
            }>>,
            magazines: [] as Array<{
                name: string,
                id: string,
                description: string,
                sprite: Array<string>,
                color?: string,
                capacity?: number,
                damage?: number,
                ap?: number,
            }>,
            lore: ""}

        await prototype.tryGetPrototypeValue(prototype, "RMCSelectiveFire", ["baseFireModes"], async (value) => {
            formattedData.stats["fireMode"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCWeaponAccuracy", ["accuracyMultiplier"], async (value) => {
            formattedData.stats["accuracyWielded"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCWeaponAccuracy", ["accuracyMultiplierUnwielded"], async (value) => {
            formattedData.stats["accuracyUnWielded"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCSelectiveFire", ["baseFireRate"], async (value) => {
            formattedData.stats["fireRate"] = value
        })
        await prototype.tryGetPrototypeValue(prototype, "RMCSelectiveFire", ["recoilUnwielded"], async (value) => {
            formattedData.stats["recoil"] = value
        })

        await prototype.tryGetPrototypeValue(prototype, "ItemSlots", ["slots", "gun_magazine","whitelist","tags"], async (value) => {
            for await (let magazineId of value) {
                if (this.prototypeCache.has(magazineId)) {
                    let mag = this.prototypeCache.get(magazineId)
                    let data = {
                        name: mag.name,
                        id: mag.id,
                        description: mag.description,
                        sprite: await mag.getSprite(),
                        capacity: 0,
                        damage: 0,
                        ap: 0
                    }

                    await mag.tryGetPrototypeValue(mag, "BallisticAmmoProvider", ["capacity"], async (value) => {
                        data.capacity = value
                    })

                    formattedData.magazines.push(data)
                }
            }
        })

        await prototype.tryGetPrototypeValue(prototype, "AttachableHolder", ["slots"], async (value) => {
            for await (let slotName of Object.keys(value)) {
                const slotNameFormatted = slotName.replace("rmc-aslot-", "")
                formattedData.attachments[slotNameFormatted] = []

                for await (let attachmentId of value[slotName].whitelist.tags) {
                    if (this.prototypeCache.has(attachmentId)) {
                        let attachment = this.prototypeCache.get(attachmentId)
                        formattedData.attachments[slotNameFormatted].push({
                            id: attachment.id,
                            name: attachment.name,
                            description: attachment.description,
                            sprite: await attachment.getSprite()
                        })
                    }
                }
            }
        })
        // If this specific item doesnt have lore, dont get from parents
        formattedData.lore = prototype.tryGetComponentValue("RMCLoreExaminable", ["content"], "")

        formattedData.sprite = await prototype.getSprite()
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

