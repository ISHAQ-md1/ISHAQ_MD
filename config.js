const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "ISHAQ-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0RIRFNWK3R6Tm9samhWTGJsWGU5OTZ4RE0vaGFPRk5ZNGNnV0M5YzMwZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUWpiVVYvd0ZHaGZsNlhCL2RBU1NFdGdpS0JJLy9ZVURpR2FpbGNxN1ZBTT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpTkRBOFZFV3RsajkwWWQ0bXNyVktuY2ZUTUtWRnVpWFZiMFR5MGhsTkhBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVSUtvRy9rRjk2MXZKeWljSS84WEdhUnRCZHRaZnNPREpnekxES1FJL1ZvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFCajVRdTNYVXFmbVgwNnp1YmZnVnE0MENNVXkxN2d6NS94SW43NnZsRVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IllWNVJzbGd2MFQ0MktCNC9wdHhLbG5FWDVZS1VYTG5TR2ZXZ09sdFNsSEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0NGcTdxcEQyWXRZRXFxNG1PMGtMdlpPVUpLM3krUU54RUkwL0hZakgwWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieXBUam9vUzJkNDE3S0MzV0dtZzFTdW80NlBtSGhZVXNENlRMSnRyK2RSaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlwOCtqTWpwdEtKeS82RUV5ODllZTNxaXJsKzI0Mlh0UDhoL0xOWkFqK05Yb3lEOGkvOU93bWJKemZRYWRBUUxma2s2aUtlZk9PdFB5c1FGdkpTZUJnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjIsImFkdlNlY3JldEtleSI6IklqbEs0ZlJ0TlZiZnZFYVJ4a0VqUGRTRDZzS2xhUnVzdjIxV2RWUjRoZE09IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiTFpDOEJXQjIiLCJtZSI6eyJpZCI6IjkyMzEzNDE1ODg0MDozMUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwk4ap4p+1zL3MoM2iIPCdl5zwnZay8J2Yj/CdmIjwnZCQy5DNosK78JOGqlxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIPCThqnin7XMvcygzaIg8J2Qh/CdkajwnZKe77yr8J2ZtPCdkYXwk4aqIiwibGlkIjoiMTc0Mzg0ODQ5NDE2MjM2OjMxQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUCtQN2ZzRkVPYkMwYzhHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoidkJSWnc4TzZjK2JiN0UxNGlJdW5QUTlXYjhmRmp4NXI4dm51d2lUaytYQT0iLCJhY2NvdW50U2lnbmF0dXJlIjoieWdsRmdDLzROczNyZlVuaE1GOWRTUENRNU84SEhycGM5aSsrd05yUFRoYndZQU9pWjN6NWlUMGRodW9Qem8vSHNmMko4RS9MM1h0THRVZE5TNzVYQlE9PSIsImRldmljZVNpZ25hdHVyZSI6InhZa1pubGh5eS94U0lXemFHd2NyNlRJelNONU5YTDMxQklXeEF3Q2YyM25RVUxmZ2p5LzdnbmVEeFdGdFZUbmk1WXp3RTlSM29hWUEwVFBKWjAvR0J3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMTc0Mzg0ODQ5NDE2MjM2OjMxQGxpZCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJid1VXY1BEdW5QbTIreE5lSWlMcHowUFZtL0h4WThlYS9MNTdzSWs1UGx3In19XSwicGxhdGZvcm0iOiJzbWJhIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQVVJQWdnTiJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Nzc2MjM0MDMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTnBqIn0=",  // Your bot's session ID (keep it secure)
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
        
