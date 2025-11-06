
import type { Attachment, Collection } from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { Jimp } from "jimp";
import { diff } from "@jimp/diff";
import path from "path";


const imageFolder = path.join(__dirname, "../images")


export default async function (urls: Collection<string, Attachment>) {
    let files: ArrayBuffer[] = [];
    let score = 0;
    let threshold = 1;
    let diffPercent = 0.03; // 3%

    for (let fileName of readdirSync(imageFolder)) {
        if (fileName.endsWith(".png") || fileName.endsWith(".jpg"))
            files.push(readFileSync(path.join(imageFolder, fileName)).buffer);
    }

    for (let a of urls) {
        if (a[1].contentType?.startsWith("image/")) {
            var attachment = (await (await fetch(a[1].url)).arrayBuffer());
            for (let file of files) {
                var result = await CompareImages(file, attachment)
                if (result < diffPercent)
                    score++
            }
        }
    }

    if (score >= threshold)
        return "CRYPTO_WALLET"
    else
        return false;
}

export async function CompareImages(img1: ArrayBuffer, img2: ArrayBuffer) {
    const image1 = await Jimp.read(img1);
    const image2 = await Jimp.read(img2);

    // mild blur to handle camera/screen pixely issues, idk how much this actually blurs
    image1.blur(2);
    image2.blur(2);
    
    let result = diff(image1, image2);
    console.log(result.percent)
    return result.percent
}