const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})



const Eris = require("eris");
const Util = require("./util");
const Sheet = require("./sheet");
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config()

const doc = new GoogleSpreadsheet('1AmNKyPKO614IjBinzTZaHrsreePpNfrCjA8WWjW6LuI');
const sheet = new Sheet(doc);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
}).then(async () => {
    await doc.loadInfo();
});

const bot = new Eris(process.env.DISCORD_BOT_TOKEN, {
    intents: [
        "guildMessages"
    ]
});

bot.on("ready", () => {
    console.log("Bot is connected and ready!");
});

bot.on("error", (err) => {
    console.error(err);
});

bot.on("messageCreate", async (msg) => {
    if (msg.content.startsWith("#")) {
        if (Util.isAdmin(msg.author) || 1 == 1) {
            const commandList = msg.content.split(" ");

            if (commandList && commandList.length > 0) {

                if (sheet.isExistSheet(commandList[0].slice(1))) {

                    // Thực hiện load dữ liệu
                    await sheet.loadCell();

                    if (commandList.length == 1) {
                        bot.createMessage(msg.channel.id, sheet.getHuongDan(commandList[0]));
                    } else {
                        const command = commandList[1];
                        switch (command) {
                            case "hocphi":
                                const data = sheet.getHocPhiText();
                                bot.createMessage(msg.channel.id, data);
                                break;

                            case "nhanxet":
                                bot.createMessage(msg.channel.id, sheet.getLink());
                                break;

                            default:
                                break;
                        }
                    }

                } else {
                    bot.createMessage(msg.channel.id, "Không tồn tại học viên");
                }
            }
            // Xử lý các lệnh ở đây
        } else {
            bot.createMessage(msg.channel.id, "Bạn không phải là giáo viên...");
        }
    }
});

bot.connect();


app.listen(80)


module.exports = app;