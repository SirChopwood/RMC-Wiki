import * as path from 'path';
import * as fs from "node:fs";
// @ts-ignore
import {PrototypeConverter} from "../converter.ts";
// @ts-ignore
import Prototype from "../prototype.ts";

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
        for await (const wepCat of this.weaponCategories) {
            fs.writeFileSync(path.join(this.contentDir, "weapons", `${wepCat.toLowerCase()}.md`), await this.convertPrototypesInDirectory(`_RMC14/Entities/Objects/Weapons/Guns/${wepCat}`))
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

        let attachments: Record<string, Array<string>> = {}
        if (prototype.components.has("AttachableHolder")) {
            for (let slotName of Object.keys(prototype.components.get("AttachableHolder").slots)) {
                const slotNameFormatted = slotName.replace("rmc-aslot-", "")
                attachments[slotNameFormatted] = prototype.components.get("AttachableHolder").slots[slotName].whitelist.tags
            }
        }

        let stats = new Map()
        prototype.tryGetComponent("RMCSelectiveFire", ["baseFireModes"], (value) => {
            stats.set("fireMode", `[${value.join(", ")}]`)
        })
        prototype.tryGetComponent("RMCWeaponAccuracy", ["accuracyMultiplier"], (value) => {
            stats.set("accuracyWielded", value)
        })
        prototype.tryGetComponent("RMCWeaponAccuracy", ["accuracyMultiplierUnwielded"], (value) => {
            stats.set("accuracyUnWielded", value)
        })
        prototype.tryGetComponent("RMCSelectiveFire", ["baseFireRate"], (value) => {
            stats.set("fireRate", value)
        })
        prototype.tryGetComponent("RMCSelectiveFire", ["recoilUnwielded"], (value) => {
            stats.set("recoil", value)
        })

        let sprite = ["Effects/crayondecals.rsi/questionmark.png"]
        prototype.tryGetComponent("Sprite", [], (value) => {
            if (value.layers && value.layers.length > 0) {
                sprite = []
                for (const layer of value.layers) {
                    if (layer.sprite) {
                        sprite.push(`${layer.sprite}/${layer.state}.png`)
                    } else {
                        sprite.push(`${value.sprite}/${layer.state}.png`)
                    }
                }
            } else if (value.sprite && value.state) {
                sprite = [`${value.sprite}/${value.state}.png`]
            }
        })
        return this.fillTemplate(
            prototype.name,
            sprite,
            prototype.id,
            prototype.description,
            stats,
            attachments,
            [
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
            ],
            prototype.tryGetComponentValue("RMCLoreExaminable", ["content"], "")
        )
    }



    fillTemplate(
        displayName: string,
        sprite: Array<string>,
        id: string,
        description: string,
        stats: Map<string, string>,
        attachments: Record<string, Array<string>>,
        magazines: Array<{
            name: string,
            id: string
            icon: string,
            color?: string,
            capacity?: number,
            damage?: number,
            ap?: number,
        }>,
        lore?: string
    ) {
        let newAttachments = ""
        for (const key of Object.keys(attachments)) {
            newAttachments += `\n    ${key}: ${JSON.stringify(attachments[key])}`
        }
        newAttachments = newAttachments.replace("\n","")

        let newStats = ""
        // @ts-ignore
        for (const [key, value] of stats.entries()) {
            newStats += `\n${key}: ${value}`
        }
        newStats = newStats.replace("\n","")

        let template =  `## ${displayName}
::weapon-profile
---
sprite: ${JSON.stringify(sprite)}
---
::
:hatnote{icon=false}[ID: ${id}]
:pull-quote[${description}]
::weapon-stats
---
${newStats}
---
::
::weapon-attachments
---
attachments:
${newAttachments}
---
::
::weapon-ammunition
---
magazines: ${JSON.stringify(magazines)}
---
::`
        if (lore) template += `\n:collapsible{title="Show Lore"}[${lore}]`
        template += `\n<br><br><br><br>\n`
        return template
    }
}

