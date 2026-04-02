const { cmd } = require('../command');

cmd({
    pattern: "staff",
    alias: ["admins", "adminlist"],
    react: "👑",
    desc: "Show group admins list",
    category: "group",
    use: ".staff",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, groupMetadata, groupName, participants, groupAdmins, reply }) => {
    try {
        if (!isGroup) {
            return reply("❌ This command only works in groups");
        }

        // Get group profile picture
        let pp;
        try {
            pp = await conn.profilePictureUrl(from, 'image');
        } catch {
            pp = 'https://files.catbox.moe/f1ygtp.jpg'; // Default image
        }

        // Get admins from participants
        const adminList = groupAdmins.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n▢ ');
        
        // Get group owner
        const owner = groupMetadata.owner || groupAdmins[0] || from.split('-')[0] + '@s.whatsapp.net';

        // Create staff text
        const text = `
👑 *GROUP ADMINS* - ${groupName}

┌─⊷ *ADMINISTRATORS*
▢ ${adminList}
└───────────

📊 *Total Admins:* ${groupAdmins.length}
`.trim();

        // Send the message with image and mentions
        await conn.sendMessage(from, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins, owner],
            contextInfo: {
                mentionedJid: [...groupAdmins, owner],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363407200499690@newsletter',
                    newsletterName: "𝑰𝑺𝑯𝑨𝑸-𝐌𝐃",
                    serverMessageId: 143,
                },
            },
        }, { quoted: m });

    } catch (error) {
        console.error('Staff Command Error:', error);
        reply("❌ Failed to get admin list!");
    }
});
