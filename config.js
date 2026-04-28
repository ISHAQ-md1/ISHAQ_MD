const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "ISHAQ-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkQyTTduVDl3Uzltbk5HSENXRll0dVJlMUhLKzJzVGk5dzd4dEJiRUhYYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0M0ejJFbUpMM1ZqR3JwU0d3SEg2UmJ3N0greGhCQVJoNFQyY2tBUEtCTT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQjVoaWNzYWkvZ3dzelNzQ3Z4cWN2TWlydlpTaVFUSHl5aGZlOTJMeTI4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2QWNVTTd6UlVhQVlWOGVEYUdweGdGRTl2TURmOVhyRGRiQWxMTFg3cW1nPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhJb25XeGJwaVJtTStBamRYYStQRVlsb2lVN1ZYTzQvaG9nOXkwRG9Dazg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkkwWUJpTTN5YnVubUFZb1RobCt2TmhQM1pnRHhBZjY3UUpiaSs1RW0xazQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOEtQM25TMm0xdzhaZjl4TVZYUUtBOStwd2Q0OUdqZHV0ZU9EVW1YWkpXUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieGt6cmczdzRrc3BaWklzbG8rMnd5RTF5RWN1aWpWYVZVRWR2R3FCdlhUQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndZdlBBVk4yY09uSldOc2NkdUtZTVlJZVlQWkJ0SUxNYzRZRkx3bEZHTHc3TXVBNHIyZFIwWlFOMXo0cGlQUDV5YWJPMy8vcEc4aXJKY0VKZmRmY0R3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTMwLCJhZHZTZWNyZXRLZXkiOiJDeUtITm9Wb0lnVEpRRHN6eDI1ay9WeERZR3lXUE1scHNndDhvV3cvc1RzPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6ODEzLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6ODEzLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IkFONEdIU0w5IiwibWUiOnsiaWQiOiI2MDExNTY3MDc1Nzg6MjJAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoi8JOGqeKftcy9zKDNoiDwnZec8J2WsvCdmI/wnZiI8J2QkMuQzaLCu/CThqpcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiDwk4ap4p+1zL3MoM2iIPCdkIfwnZGo8J2Snu+8q/CdmbTwnZGF8JOGqiIsImxpZCI6IjIxNzQ1NDg4MjEwNzQ4OToyMkBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ1B6Y2o1VUJFT1dKdzg4R0dBSWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6Imlrakd0ZE1xUTFvT200VUdYS3pqZnhJYk1RQmYzV204WTFIMXQ3dVBvVGs9IiwiYWNjb3VudFNpZ25hdHVyZSI6Ijg3RDlqNEJKSXFqRmhsZFJZcWpBemZvS251UWQzS08vODJHa2RqQ3pycGRVV2JLeHZxSDIvYkRtbmhCYUR4RWh3aE5pMDhhamlMV2lSS3hnOHdtMERBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJLS21uNDc4UHpOUTRCeDBDb1ZidUZNZHExOTF5SzV1cXVGK0ZVUE0zSXdWSncyZjhSUWRGWlJkaURiUGZWTldYcGx6Tk55YjJXaGduQnZUT0RpWUdCdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIxNzQ1NDg4MjEwNzQ4OToyMkBsaWQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCWXBJeHJYVEtrTmFEcHVGQmx5czQzOFNHekVBWDkxcHZHTlI5YmU3ajZFNSJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0JJSUFnZ04ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzc3Mzg2NzMzLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUoweSJ9",  // Your bot's session ID (keep it secure)
    PREFIX: getConfig("PREFIX") || ".",  // Command prefix (e.g., "., / ! * - +")
    CHATBOT: getConfig("CHATBOT") || "on", // on/off chat bot 
    BOT_NAME: process.env.BOT_NAME || getConfig("BOT_NAME") || "𝑰𝑺𝑯𝑨𝑸-𝐌𝐃",  // Bot's display name
    MODE: getConfig("MODE") || process.env.MODE || "public",        // Bot mode: public/private/group/inbox
    REPO: process.env.REPO || "https://github.com/NLL/forkhttps://github.com/NULLL/ISHAQ-MD",  // Bot's GitHub repo
    BAILEYS: process.env.BAILEYS || "@whiskeysockets/baileys",  // Bot's BAILEYS

    // ===== OWNER & DEVELOPER SETTINGS =====
    OWNER_NUMBER: process.env.OWNER_NUMBER || "923134158840",  // Owner's WhatsApp number
    OWNER_NAME: process.env.OWNER_NAME || getConfig("OWNER_NAME") || "𝑰𝑺𝑯𝑨𝑸-𝐌𝐃",           // Owner's name
    DEV: process.env.DEV || "923134158840",                     // Developer's contact number
    DEVELOPER_NUMBER: '923134158840@s.whatsapp.net',            // Developer's WhatsApp ID

    // ===== AUTO-RESPONSE SETTINGS =====
    AUTO_REPLY: process.env.AUTO_REPLY || "false",              // Enable/disable auto-reply
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",// Reply to status updates?
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*𝑰𝑺𝑯𝑨𝑸-𝐌𝐃 VIEWED YOUR STATUS 🤖*",  // Status reply message
    READ_MESSAGE: process.env.READ_MESSAGE || "false",          // Mark messages as read automatically?
    REJECT_MSG: process.env.REJECT_MSG || "*📞 𝐒𝐎𝐑𝐑𝐘 𝐈 𝐀𝐌 𝐁𝐔𝐒𝐒𝐘 𝐊𝐄𝐈𝐎 𝐊𝐀𝐌 𝐇𝐀 𝐓𝐎 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐊𝐑 𝐃𝐄 𝐒𝐇𝐎𝐊𝐑𝐈𝐀 ɪsʜᴀǫ-ᴍᴅ*",
    // ===== REACTION & STICKER SETTINGS =====
    AUTO_REACT: process.env.AUTO_REACT || "false",              // Auto-react to messages?
    OWNER_REACT: process.env.OWNER_REACT || "false",              // Auto-react to messages?
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",          // Use custom emoji reactions?
    CUSTOM_REACT_EMOJIS: getConfig("CUSTOM_REACT_EMOJIS") || process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",  // set custom reacts
    STICKER_NAME: process.env.STICKER_NAME || "𝑰𝑺𝑯𝑨𝑸-𝐌𝐃",     // Sticker pack name
    AUTO_STICKER: process.env.AUTO_STICKER || "false",          // Auto-send stickers?
    // ===== MEDIA & AUTOMATION =====
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",      // Auto-record voice notes?
    AUTO_TYPING: process.env.AUTO_TYPING || "false",            // Show typing indicator?
    MENTION_REPLY: process.env.MENTION_REPLY || "true",   // reply on mentioned message 
    MENU_IMAGE_URL: getConfig("MENU_IMAGE_URL") || "https://files.catbox.moe/f1ygtp.jpg",  // Bot's "alive" menu mention image

    // ===== SECURITY & ANTI-FEATURES =====
    ANTI_DELETE: process.env.ANTI_DELETE || "false", // true antidelete to recover deleted messages 
    ANTI_CALL: process.env.ANTI_CALL || "true", // enble to reject calls automatically 
    ANTI_BAD_WORD: process.env.ANTI_BAD_WORD || "false",    // Block bad words?
    ANTI_LINK: process.env.ANTI_LINK || "true",    // Block links in groups
    ANTI_VV: process.env.ANTI_VV || "true",   // Block view-once messages
    DELETE_LINKS: process.env.DELETE_LINKS || "false",          // Auto-delete links?
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same", // inbox deleted messages (or 'same' to resend)
    ANTI_BOT: process.env.ANTI_BOT || "true",
    PM_BLOCKER: process.env.PM_BLOCKER || "false",

    // ===== BOT BEHAVIOR & APPEARANCE =====
    DESCRIPTION: process.env.DESCRIPTION || "*© CREATER 𝑰𝑺𝑯𝑨𝑸-𝐌𝐃*",  // Bot description
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",              // Allow public commands?
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "true",        // Show bot as always online?
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true", // React to status updates?
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true", // VIEW to status updates?
    AUTO_BIO: process.env.AUTO_BIO || "false", // ture to get auto bio 
    WELCOME: process.env.WELCOME || "false", // true to get welcome in groups 
    GOODBYE: process.env.GOODBYE || "false", // true to get goodbye in groups 
    ADMIN_ACTION: process.env.ADMIN_ACTION || "true", // true if want see admin activity 
};
        
