const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: Mbuvi_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function VAMPARINA_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_VAMPARINA = Mbuvi_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });

            if (!Pair_Code_By_VAMPARINA.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_VAMPARINA.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_VAMPARINA.ev.on('creds.update', saveCreds);
            Pair_Code_By_VAMPARINA.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_VAMPARINA.sendMessage(Pair_Code_By_VAMPARINA.user.id, { text: 'VAMPARINA:~' + b64data });

                    let VAMPARINA_TEXT = ` 
╔═══════════════════════════◇
║       VAMPARINA CONNECTED
║ Session Active & Working
║ Base64 Session Type
║ © 2025 Arnold Chirchir
║ +254703110780
╚═══════════════════════════╝`;

                    await Pair_Code_By_VAMPARINA.sendMessage(Pair_Code_By_VAMPARINA.user.id, { text: VAMPARINA_TEXT }, { quoted: session });

                    await delay(100);
                    await Pair_Code_By_VAMPARINA.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    VAMPARINA_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log('VAMPARINA Service restarted');
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }
    
    return await VAMPARINA_PAIR_CODE();
});

module.exports = router;