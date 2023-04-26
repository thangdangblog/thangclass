const express = require('express')
const { Configuration, OpenAIApi } = require("openai");
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/demo', function (req, res) {
    res.send('Hello World')
})

const Eris = require("eris");
const Util = require("./util");
const Sheet = require("./sheet");
const { GoogleSpreadsheet } = require('google-spreadsheet');

require('dotenv').config()

const doc = new GoogleSpreadsheet('1AmNKyPKO614IjBinzTZaHrsreePpNfrCjA8WWjW6LuI');
const sheet = new Sheet(doc);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


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

async function runCompletion(message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 200,
    });
    return completion.data.choices[0].text;
}

bot.on("ready", () => {
    console.log("Bot is connected and ready!");
});

bot.on("error", (err) => {
    console.error(err);
});

bot.on("messageCreate", async (msg) => {
    try {
        if (msg && msg.mentions && msg.mentions[0] && msg.mentions[0].discriminator == 8669) {

            const commandList = msg.content.trim().split(" ");

            console.log(commandList);
            if (commandList && commandList.length > 0) {
                const authorDiscriminator = msg.author.discriminator;
                if (sheet.isExistSheet(authorDiscriminator)) {

                    // Thực hiện load dữ liệu
                    await sheet.loadCell();

                    if (commandList.length == 1) {
                        bot.createMessage(msg.channel.id, sheet.getHuongDan());
                    } else {
                        commandList.splice(0, 1);
                        const command = commandList.join(" ");
                        console.log(command);
                        switch (command) {
                            case "hocphi":
                                const data = sheet.getHocPhiText();
                                bot.createMessage(msg.channel.id, data);
                                break;
                            case "học phí":
                                bot.createMessage(msg.channel.id, sheet.getHocPhiText());
                                break;

                            case "nhanxet":
                                bot.createMessage(msg.channel.id, sheet.getLink());
                                break;

                            case "nhận xét":
                                bot.createMessage(msg.channel.id, sheet.getLink());
                                break;

                            default:
                                runCompletion(msg.content.substring(1)).then(result => bot.createMessage(msg.channel.id, result));
                                break;
                        }
                    }
                } else {
                    runCompletion(msg.content.substring(1)).then(result => bot.createMessage(msg.channel.id, result));
                }
            }
        }
    } catch (error) {
        bot.createMessage(msg.channel.id, "Thắng giúp việc mệt quá, cần phải nghỉ ngơi...");
    }

});

bot.connect();


app.listen(3000)

module.exports = app;
