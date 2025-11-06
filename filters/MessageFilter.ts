import path from "path";
import { CompareImages } from "./ImageFilter";
import { readdirSync, readFileSync } from "fs";

let keywords = [
    {
        name: 'STEAM_GIFT',
        criteria: [
            "steam",
            "$50",
            "50$",
            "gift",
            "card",
            "[steamcommunity.com/gift-card/pay/50]",
            "[steamcommunity.com/gift/789905492499]",
            "https://e.vg/ylagwcmdq",
            "@everyone",
        ],
        maxScore: 3,
        buffer: 2,
        imageSearch: false
    },
    {
        name: 'CRYPTO_WALLET',
        criteria: [
            "cryptoScam/scam1.png",
            "cryptoScam/scam2.png",
            "cryptoScam/scam3.png",
            "cryptoScam/scam4.png",
        ],
        maxScore: 1,
        buffer: 0,
        imageSearch: true
    }
]

export default async function (str: String) {
    let message = str.toLowerCase().split(" ");
    let score = 0;
    let words = message.length;
    let type: boolean | string = false;
    let found = false

    for (let entry of keywords) {
        if (found) break;
        score = 0;
        type = false;
        for (let word of message) {
            if (entry.imageSearch) {
                if (word.startsWith("https://cdn.discordapp.com") && (word.includes(".png") || word.includes(".jpg"))) {
                    try {
                        let attachment = (await (await fetch(word.replace(" ", ""))).arrayBuffer());
                        for (let obj of entry.criteria) {
                            if (await CompareImages(attachment, readFileSync(path.join(__dirname, "../images", obj)).buffer) < 0.03) { // less than 3% difference triggers
                                score++
                            }
                        }
                    } catch (e) {
                        console.warn("ERROR: " + e)
                    }
                }

            } else {
                entry.criteria.forEach(obj => {
                    if (word.toLowerCase().includes(obj.toLowerCase())) {
                        score++
                    }
                })
            }


            if (score >= entry.maxScore) {
                if (entry.imageSearch || (words - score) - entry.buffer < 0) {
                    found = true;
                    type = entry.name;
                    break;
                }
            }
        }
    }
    //process.exit(0)
    return type;

}

/*
for (let word of keywords) {
    if (object.includes(word.toLowerCase()))
        score++;
    if (object.includes("@everyone"))
        score = score + 3
}

let keywords = [
    {
        "name": "STEAM_GIFT",
        "criteria": [
            "steam",
            "$50",
            "gift",
            "card",
            "[steamcommunity.com/gift-card/pay/50]",
            "@everyone"
        ]
    }
]

export default function (str: String) {
    let string = str.toLowerCase().split(" ");
    let score = 0;
    let threshold = 5;
    let words = string.length
    let idk = 3
    let type: Boolean | String = false;

    for (let object of keywords) {
        string.forEach(word => {
            for (let obj of object.criteria) {
                if (word.includes(word.toLowerCase())) {
                    score++;
                    if (type) {
                        type = type + `, ${object.name}`
                    } else type = object.name

                }
                if (word.includes("@everyone"))
                    score = score + 3
            }
        })
        if (score >= threshold) break;
    }

    if (score >= threshold && (words - score) - idk < 0)
        return type;
    else
        return false;
}

            */