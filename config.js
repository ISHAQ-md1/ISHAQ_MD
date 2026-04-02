const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "ISHAQ-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUJQNVpjSkFmVVoxazNlUDQ3cFpjc3Ewa0toOWdjR1FBUytLOUtkVDdrcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL3M1bGpkRG8zL01QWHlPV0VCaGhNZm9xbDJrQ1czbHZkSUZtWkJDa3VGRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrSWc3SWtsbHJZbU84cW5qQmxEenB6UVNsSWdLNkxlb0tyandWVm9aZFZvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkazlrS3B6Sk1CYTRSOUdpSjNIU3B5dWZXc1NwV1NUYTdLS1JZdUplbng4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNOTDE0WFc1RU9vdU01cG5LU0ZVNGhYVGVoNFBieTd4ZDN1akJDOWdrRUk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImV1aXE2eS9ENWhEY0JGL1B1Q2U0cUpMeXYvL3loTVo1dDBYcWtvaDZzd289In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib05oSk91ZjJ1Wk8zYlUvTStyek5raU9vSk9SY3NCaWFUUlpsaGdFbWJWOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidE1jRllmeU9PLzVURC9MU3IrbzFJVDhrSDZTY0dvNHVwTVQ0YUozUVNYRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1sRndNcG9CRmd3SFFEVm1vNXlSbHZCSkVVa2JxSFp5bzdUWkhPM1VDdm1vVVJmcWFNaVpXdGJ3bTN1MU1YQUxTSUE1YTRsSy9QblgwMFFtSmcvMEJnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjYsImFkdlNlY3JldEtleSI6InM1c3NBTi8zUTdyaW9iTTBtSE5mT2w4c1hUNUhiTk1tYWV6enN5SVYva2s9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiUzU5UkQ4S0wiLCJtZSI6eyJpZCI6IjkyMzMwNzA5MjIxNDo2NUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwk4ap4p+1zL3MoPCdkIhT77yo8J2XlPCdkJDNosK78JOGqlxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIPCThqnwnZCH8J2RqPCdkp7vvKvwnZm08J2RhS14MzLwk4aqIiwibGlkIjoiNzU0NzE3NTI1NzcxODM6NjVAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLajcyYW9FRU9PRnVjNEdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJMSmxiaWhraWY0QWlITU9Za2ZpbFhwdCt2a2lWTHR5ODJvaXJlV2RDR1IwPSIsImFjY291bnRTaWduYXR1cmUiOiJ5R3h4T21lSlNiTS9kQ0E1aW1rV3VzMHY5UlZaRkFJSjZ5dmZNL3lWa0hGdmI0WHNaeWRxRGVjeHRXQmpvdWM5b1JkaG5IbGFzWk1wYnZaY1k1WDlCUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiT1J4UldOR1FUY2lUd1RYeG5GcUQyYmZpNEwzOUVFcm9GZkl0U3VGUlMySGhXalFNb1pNTW9QUmhPUVM5UmFHZk5aSWQvay9XYUhPZUp2d0JER1hMQ0E9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI3NTQ3MTc1MjU3NzE4Mzo2NUBsaWQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCU3laVzRvWkluK0FJaHpEbUpINHBWNmJmcjVJbFM3Y3ZOcUlxM2xuUWhrZCJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FnSUFnZ1MifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzc1MTI1MjI2LCJsYXN0UHJvcEhhc2giOiIzbWwxalMifQ==",  // Your bot's session ID (keep it secure)
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
        
