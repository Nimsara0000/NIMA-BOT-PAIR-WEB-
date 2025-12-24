const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    Browsers, 
    makeCacheableSignalKeyStore, 
    DisconnectReason 
} = require('@whiskeysockets/baileys');

const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    // වලංගු අංක පරීක්ෂාව
    if (!num) {
        return res.status(400).send({ error: "Phone number is required" });
    }
    
    async function MALVIN_XD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        
        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                
                // අංකය වලංගු දැයි පරීක්ෂා කිරීම
                if (num.length < 10) {
                    throw new Error("Invalid phone number");
                }
                
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    return res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            
            sock.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect } = update;
                
                if (connection == "open") {
                    await delay(5000);
                    
                    try {
                        // credentials file path
                        let rf = `./temp/${id}/creds.json`;
                        
                        if (!fs.existsSync(rf)) {
                            throw new Error("Credentials file not found");
                        }
                        
                        // Mega වෙත upload කිරීම
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        
                        if (!mega_url) {
                            throw new Error("Upload failed");
                        }
                        
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "NIMA~MD&" + string_session;
                        
                        // පරිශීලකයාට session ID එවීම
                        let codeMsg = await sock.sendMessage(sock.user.id, { text: md });
                        
                        let desc = `𝗛𝗘𝗬 𝗧𝗛𝗘𝗥𝗘 𝗟𝗢𝗞𝗨 𝗡𝗜𝗠𝗔𝗛 𝗨𝗦𝗘𝗥 👋🏻

𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗡𝗜𝗠𝗔 𝗠𝗗 𝗬𝗢𝗨𝗥 𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗖𝗥𝗘𝗔𝗧𝗘𝗗 !

🔐 𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗜𝗗: 𝗦𝗘𝗡𝗧 𝗔𝗕𝗢𝗩𝗘
⚠️ 𝗞𝗘𝗘𝗣 𝗜𝗧 𝗦𝗔𝗙𝗘 ! 𝗗𝗢 𝗡𝗢𝗧 𝗦𝗛𝗔𝗥𝗘 𝗧𝗛𝗜𝗦 𝗜𝗗 𝗪𝗜𝗧𝗛 𝗔𝗡𝗬𝗢𝗡𝗘❗.

——————

𝗦𝗧𝗔𝗬 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 :
*ᴊᴏɪɴ ᴏᴜʀ ᴏꜰꜰɪᴄɪᴀʟ ᴄʜᴀɴɴᴇʟ:*  
https://youtube.com/@nimayt-i7y?si=GxN5wFtoRwzyDNUn

> 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆  𝗟𝗼𝗸𝘂 𝗡𝗶𝗺𝗮`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "𝗡𝗜𝗠𝗔 𝗠𝗗",
                                    thumbnailUrl: "https://files.catbox.moe/8r95u5.jpg",
                                    sourceUrl: "https://youtube.com/@nimayt-i7y?si=GxN5wFtoRwzyDNUn",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        }, { quoted: codeMsg });
                        
                    } catch (uploadError) {
                        console.error("Upload error:", uploadError);
                        
                        // දෝෂ පණිවුඩය එවීම
                        let errorMsg = await sock.sendMessage(sock.user.id, { 
                            text: `❌ Error: ${uploadError.message}` 
                        });
                        
                        let desc = `𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗖𝗥𝗘𝗔𝗧𝗘𝗗 𝗕𝗨𝗧 𝗨𝗣𝗟𝗢𝗔𝗗 𝗙𝗔𝗜𝗟𝗘𝗗 ❗

⚠️ 𝗠𝗔𝗡𝗨𝗔𝗟𝗟𝗬 𝗦𝗔𝗩𝗘 𝗬𝗢𝗨𝗥 𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗙𝗥𝗢𝗠 𝗧𝗛𝗘 𝗙𝗜𝗟𝗘

——————

𝗦𝗧𝗔𝗬 𝗨𝗣𝗗𝗔𝗧𝗘𝗗:
*ᴊᴏɪɴ ᴏᴜʀ ᴏꜰꜰɪᴄɪᴀʟ ᴄʜᴀɴɴᴇʟ:*  
https://youtube.com/@nimayt-i7y?si=GxN5wFtoRwzyDNUn

> 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗟𝗼𝗸𝘂 𝗡𝗶𝗺𝗮`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "𝗡𝗜𝗠𝗔 𝗠𝗗",
                                    thumbnailUrl: "https://files.catbox.moe/8r95u5.jpg",
                                    sourceUrl: "https://youtube.com/@nimayt-i7y?si=GxN5wFtoRwzyDNUn",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        }, { quoted: errorMsg });
                    }
                    
                    // සම්බන්ධතාවය වසා දත්ත පිරිසිදු කිරීම
                    try {
                        await sock.ws.close();
                        removeFile('./temp/' + id);
                        console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅`);
                    } catch (closeError) {
                        console.error("Close error:", closeError);
                    }
                    
                    await delay(100);
                    process.exit(0);
                    
                } else if (connection === "close") {
                    if (lastDisconnect && lastDisconnect.error && 
                        lastDisconnect.error.output && 
                        lastDisconnect.error.output.statusCode !== 401) {
                        
                        await delay(2000);
                        MALVIN_XD_PAIR_CODE();
                    }
                }
            });
            
        } catch (err) {
            console.error("Error in MALVIN_XD_PAIR_CODE:", err);
            
            // තාවකාලික ගොනු පිරිසිදු කිරීම
            removeFile('./temp/' + id);
            
            if (!res.headersSent) {
                res.status(500).send({ 
                    code: "Service Error", 
                    error: err.message 
                });
            }
        }
    }
    
    return await MALVIN_XD_PAIR_CODE();
});

module.exports = router;
