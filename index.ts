import { Client, Events, GatewayIntentBits, } from "discord.js";
import ImageFilter from "./filters/ImageFilter";
import MessageFilter from "./filters/MessageFilter";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

const token = "MTQzNTY5OTA5NTYzMjIxNjE5NQ.G5uy_G.-gEv76MpBB8IJDSpZ9A2YktEAFMCjoFtQBiIRQ";

function main() {
    client.on(Events.ClientReady, readyClient => {
        console.log(`Logged in as ${readyClient.user.tag}!`);
    });
    client.on(Events.MessageCreate, async message => {
        if (message.author.bot) return;
        //console.log(message.content)
        //process.exit(0);
        let MFilter = await MessageFilter(message.content);
        if (MFilter != false) {
            notify(message.author.id, message.author.displayName, MFilter);
        }
        if (message.attachments.size != 0) {
            let IFilter = await ImageFilter(message.attachments);
            if (IFilter) {
                notify(message.author.id, message.author.displayName, IFilter);
            }
        }
        
    });

    client.login(token);
}

function notify(uid: String, uname: String, type: String) {
    let channel = client.channels.cache.get("1435701137478127738");
    if (channel)
        //@ts-ignore
        channel.send(`<@276531165878288385> <@${uid}> has been detected to be a scammer with type(s) ${type}!\nUID: \`${uid}\``)
}

main();