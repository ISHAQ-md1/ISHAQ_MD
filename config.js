// config.js
const fs = require('fs');
const path = require('path');

// Minimal config - all heavy features hardcoded to false
module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "",  // Only used for default/main session
    PREFIX: process.env.PREFIX || ".",
    BOT_NAME: process.env.BOT_NAME || "ISHAQ-MD MINI",
    MODE: process.env.MODE || "public",
    REPO: process.env.REPO || "",
    BAILEYS: process.env.BAILEYS || "@whiskeysockets/baileys",

    // ===== OWNER & DEVELOPER SETTINGS =====
    OWNER_NUMBER: process.env.OWNER_NUMBER || "",
    OWNER_NAME: process.env.OWNER_NAME || "Admin",
    DEV: process.env.DEV || "",
    DEVELOPER_NUMBER: process.env.DEVELOPER_NUMBER || "",

    // ===== ALL HEAVY FEATURES - HARDCODED FALSE =====
    // Anti features - ALL DISABLED
    ANTI_DELETE: "false",
    ANTI_CALL: "false",
    ANTI_BAD_WORD: "false",
    ANTI_LINK: "false",
    ANTI_VV: "false",
    DELETE_LINKS: "false",
    ANTI_BOT: "false",
    PM_BLOCKER: "false",

    // Auto features - ALL DISABLED
    AUTO_REPLY: "false",
    AUTO_STATUS_REPLY: "false",
    AUTO_STATUS_MSG: "",
    READ_MESSAGE: "false",
    AUTO_REACT: "false",
    OWNER_REACT: "false",
    CUSTOM_REACT: "false",
    CUSTOM_REACT_EMOJIS: "",
    AUTO_STICKER: "false",
    AUTO_RECORDING: "false",
    AUTO_TYPING: "false",
    MENTION_REPLY: "false",

    // Status features - ALL DISABLED
    AUTO_STATUS_REACT: "false",
    AUTO_STATUS_SEEN: "false",
    AUTO_BIO: "false",

    // Group features - ALL DISABLED
    WELCOME: "false",
    GOODBYE: "false",
    ADMIN_ACTION: "false",

    // Presence - Minimal
    ALWAYS_ONLINE: "false",
    PUBLIC_MODE: "true",
    DESCRIPTION: "© Multi-User ISHAQ-MD",
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "",
    
    // Chatbot disabled
    CHATBOT: "false",
    
    // Anti-del path not used
    ANTI_DEL_PATH: "same",
    REJECT_MSG: "",
    STICKER_NAME: "Multi-Bot"
};
