const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "ISHAQ-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEZEa2dodk1xVW8yT0VMdW9wMjROOWNkZmhmOVlsdTBPNXYrZHRSZkxXOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib3VqaWtNbUhiMUg4bzFxcXBwSlJtcWVwTWo1UmhHMHJqUjhaM25qdDgyZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJQzZYRGtOTDkvUVJrS2VIbDYybENtRHh6Y2VUeDNnNytkUFNxL3NNYTA0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzK29QYnFNNEQvZGc1bm5QVDNGYThIRUtjckkxQ3hYeGJFeFg5amxjcHdVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVNUms5UlpTSlNjeWRqaE84cVFDNEVuNEtrNDBPbWlGdXRMUWFWYXFzRzQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVqSzBjcmRBVEtJNVoxaXhKSE5XUlJJNjZPTlMrY3lxakVSdVZJeHY5Q2c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSUQ3ZjBSaE93M3N0aUhSMnhKZmhnUEN2YXlIS0JydHFSbFFVdWpqZFAyTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOWpaMkc3M2twVXlUaG53L0JpLzhBQjlBMk8xSjdhYnFKc3VtblE1YUFXRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkRVOElEVzZjVllFaU1HcU8wUW5XeUEzKzlHNkJjRFcyZk9mcSsrZWNzd2lNcmRndGFBZnJmNlF4UStxa1FiZWE4NW1EV3ZIVUxxMGJsdWExSGgwN2dnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTc0LCJhZHZTZWNyZXRLZXkiOiJBRmxPM1ZEcHN1VENRNE54b2RKRy9VR2ZROFp0WU9mbWRtSVNNR2loTXd3PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzMzODM3ODY0NkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6ZmFsc2UsImlkIjoiQUNBMUQyNEE0MTNFODg3NjE5Q0Q1NDlBMUFEM0NFNTMiLCJwYXJ0aWNpcGFudCI6IiIsImFkZHJlc3NpbmdNb2RlIjoicG4ifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc3NTM1MTE1Mn0seyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMzM4Mzc4NjQ2QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjpmYWxzZSwiaWQiOiJBQzlENDg0MzYxNjQ4MjMyQzcwMzc4NDczMzFFNTIyNyIsInBhcnRpY2lwYW50IjoiIiwiYWRkcmVzc2luZ01vZGUiOiJwbiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzc1MzUxMTUzfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMzMzgzNzg2NDZAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOmZhbHNlLCJpZCI6IkFDMDQ0NEJGQzY4NjAwNDQzOEEwRkU1OTk0MDExNzVEIiwicGFydGljaXBhbnQiOiIiLCJhZGRyZXNzaW5nTW9kZSI6InBuIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NzUzNTExNTN9XSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiUzJLM01DTlYiLCJtZSI6eyJpZCI6IjkyMzMzODM3ODY0NjoxQHMud2hhdHNhcHAubmV0IiwibGlkIjoiODUyNTU3NzE5NTk0MzA6MUBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0xpN3Q5QUNFT3JxeHM0R0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6InZoejVYcWFRWnVlRGdDZ2ZTczIwc3kyUGxIc1loOGI5eEQ5WTRIQVg0QUk9IiwiYWNjb3VudFNpZ25hdHVyZSI6Ik9Penl2ZkFTckVRM01RYkFOczlKYTF2c0NnR0F1VVh4SFFWcE84b3MxU0dhZEtEOFRrV2YrekRmMVZnSjh0Zm5pOExQMmhGeDhRNDY0ckltbGVuUkJnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJib3NUdTFLZDBOQkVSSUNzWW9iT0VaK0xxV3NubWJmREtvNWU4TVpQc0VwY0RiczNHV3NDb0NoZ2l5ZWpuYWRTSURRcjdVWU80c2xaTVptNVNOQmhqdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6Ijg1MjU1NzcxOTU5NDMwOjFAbGlkIiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmI0YytWNm1rR2JuZzRBb0gwck50TE10ajVSN0dJZkcvY1EvV09Cd0YrQUMifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBZ0lBZ2dGIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc3NTM1MTE1MCwibGFzdFByb3BIYXNoIjoiM21sMWpTIn0=",  // Your bot's session ID (keep it secure)
    PREFIX: getConfig("PREFIX") || ".",  // Command prefix (e.g., "., / ! * - +")
    CHATBOT: getConfig("CHATBOT") || "on", // on/off chat bot 
    BOT_NAME: process.env.BOT_NAME || getConfig("BOT_NAME") || "𝑰𝑺𝑯𝑨𝑸-𝐌𝐃",  // Bot's display name
    MODE: getConfig("MODE") || process.env.MODE || "public",        // Bot mode: public/private/group/inbox
    REPO: process.env.REPO || "https://github.com/NLL/forkhttps://github.com/NULLL/ISHAQ-MD",  // Bot's GitHub repo
    BAILEYS: process.env.BAILEYS || "@whiskeysockets/baileys",  // Bot's BAILEYS

    // ===== OWNER & DEVELOPER SETTINGS =====
    OWNER_NUMBER: process.env.OWNER_NUMBER || "923307092214",  // Owner's WhatsApp number
    OWNER_NAME: process.env.OWNER_NAME || getConfig("OWNER_NAME") || "𝑰𝑺𝑯𝑨𝑸-𝐌𝐃",           // Owner's name
    DEV: process.env.DEV || "923307092214",                     // Developer's contact number
    DEVELOPER_NUMBER: '923307092214@s.whatsapp.net',            // Developer's WhatsApp ID

    // ===== AUTO-RESPONSE SETTINGS =====
    AUTO_REPLY: process.env.AUTO_REPLY || "false",              // Enable/disable auto-reply
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",// Reply to status updates?
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*𝑰𝑺𝑯𝑨𝑸-𝐌𝐃 VIEWED YOUR STATUS 🤖*",  // Status reply message
    READ_MESSAGE: process.env.READ_MESSAGE || "false",          // Mark messages as read automatically?
    REJECT_MSG: process.env.REJECT_MSG || "*📞 THIS PERSON NOT ALLOWED CALL*",
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
    MENTION_REPLY: process.env.MENTION_REPLY || "false",   // reply on mentioned message 
    MENU_IMAGE_URL: getConfig("MENU_IMAGE_URL") || "https://files.catbox.moe/f1ygtp.jpg",  // Bot's "alive" menu mention image

    // ===== SECURITY & ANTI-FEATURES =====
    ANTI_DELETE: process.env.ANTI_DELETE || "true", // true antidelete to recover deleted messages 
    ANTI_CALL: process.env.ANTI_CALL || "false", // enble to reject calls automatically 
    ANTI_BAD_WORD: process.env.ANTI_BAD_WORD || "false",    // Block bad words?
    ANTI_LINK: process.env.ANTI_LINK || "true",    // Block links in groups
    ANTI_VV: process.env.ANTI_VV || "true",   // Block view-once messages
    DELETE_LINKS: process.env.DELETE_LINKS || "false",          // Auto-delete links?
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same", // inbox deleted messages (or 'same' to resend)
    ANTI_BOT: process.env.ANTI_BOT || "true",
    PM_BLOCKER: process.env.PM_BLOCKER || "true",

    // ===== BOT BEHAVIOR & APPEARANCE =====
    DESCRIPTION: process.env.DESCRIPTION || "*© CREATER 𝑰𝑺𝑯𝑨𝑸-𝐌𝐃*",  // Bot description
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",              // Allow public commands?
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",        // Show bot as always online?
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true", // React to status updates?
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true", // VIEW to status updates?
    AUTO_BIO: process.env.AUTO_BIO || "false", // ture to get auto bio 
    WELCOME: process.env.WELCOME || "false", // true to get welcome in groups 
    GOODBYE: process.env.GOODBYE || "false", // true to get goodbye in groups 
    ADMIN_ACTION: process.env.ADMIN_ACTION || "false", // true if want see admin activity 
};
        
