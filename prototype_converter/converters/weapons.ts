import * as path from 'path';
import * as fs from "node:fs";
// @ts-ignore
import {PrototypeConverter} from "../converter.ts";

export default class WeaponsPrototypeConverter extends PrototypeConverter {
    async run(): Promise<void> {
        let data = await this.convertProtoDir("_RMC14/Entities/Objects/Weapons/Guns/Rifles")

        fs.writeFileSync(path.join(this.contentDir, "weapons2.md"), data)
    }

    override async processProtoFile(fileData: object) {
        let data = this.fillTemplate(
            "M54C assault rifle MK2",
            "_RMC14/Objects/Weapons/Guns/Rifles/m54c/desert.rsi",
            "UNMC",
            "RMCWeaponRifleM54C",
            "The standard issue rifle of the Marines. Commonly carried by most combat personnel. Uses 10x24mm caseless ammunition.",
            ["SemiAuto", "Burst", "FullAuto"],
            1.3,
            0.65,
            4,
            4,
            {
                Muzzle: ["suppressor", "compensator", "extended barrel"],
                Rail: ["flashlight", "S5 red-dot sight"],
                Underbarrel: ["laser sight", "grenade launcher"]
            },
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
        )
        return data
    }

    fillTemplate(
        displayName: string,
        icon: string,
        faction: string,
        id: string,
        description: string,
        fireMode: Array<string>,
        accuracyWielded: number,
        accuracyUnWielded: number,
        fireRate: number,
        recoil: number,
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

        let template =  `## ${displayName}
:weapon-profile{icon=${icon}}
:hatnote{icon=false}[:badge{type=${faction.toLowerCase()}} ID: ${id}]
:pull-quote[${description}]
::weapon-stats
---
fireMode: [${fireMode.join(", ")}]
accuracyWielded: ${accuracyWielded}
accuracyUnWielded: ${accuracyUnWielded}
fireRate: ${fireRate}
recoil: ${recoil}
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
        template += `\n:collapsible{title="Show Lore"}[${lore}]`
        template += `\n\n`
        return template
    }
}

