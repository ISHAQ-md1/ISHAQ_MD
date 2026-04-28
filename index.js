// ============ FIX FOR BIGINT SERIALIZATION ============
const originalStringify = JSON.stringify;
JSON.stringify = function(value, replacer, space) {
    const newReplacer = function(key, val) {
        if (typeof val === 'bigint') {
            return val.toString();
        }
        if (replacer) {
            return replacer(key, val);
        }
        return val;
    };
    return originalStringify(value, newReplacer, space);
};

const axios = require('axios');
const config = require('./config');
const { 
    createSession, 
    getAllSessions, 
    updateSessionStatus, 
    deleteSession,
    getSession 
} = require('./lib/configdb');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    Browsers,
    fetchLatestBaileysVersion
} = require(config.BAILEYS);

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { sms, downloadMediaMessage } = require('./lib/msg');
const fs = require('fs');
const P = require('pino');
const path = require('path');
const express = require("express");
const app = express();

// ============ GLOBAL CONNECTIONS MAP ============
const connections = {}; // Map: userId -> { sock, status, userName }

// ============ EXPRESS SETUP ============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 20181;

// ============ SESSION DIRECTORY SETUP ============
const sessionsDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
}

// ============ PLUGINS LOADER ============
const events = require('./command');
let pluginCount = 0;

// Load all plugins from plugins folder
const pluginPath = path.join(__dirname, 'plugins');
if (fs.existsSync(pluginPath)) {
    const files = fs.readdirSync(pluginPath);
    for (const plugin of files) {
        if (path.extname(plugin).toLowerCase() === ".js") {
            try {
                require(path.join(pluginPath, plugin));
                pluginCount++;
            } catch (err) {
                console.error(`[❌] Failed to load plugin ${plugin}:`, err.message);
            }
        }
    }
    console.log(`[✅] Loaded ${pluginCount} plugins from plugins folder.`);
    console.log(`[📊] Total commands available: ${events.commands.length}`);
} else {
    console.warn('[⚠️] Plugins folder not found!');
}

// ============ HELPER FUNCTIONS ============

function getUserSessionDir(userId) {
    return path.join(sessionsDir, `user_${userId}`);
}

function decodeSessionId(sessionId) {
    try {
        let sessdata = sessionId;
        const prefixes = ['ISHAQ-MD~', 'BOSS-MD~', 'EMYOU~', 'BOT~'];
        for (const p of prefixes) {
            if (sessdata.includes(p)) {
                sessdata = sessdata.split(p)[1];
                break;
            }
        }
        
        sessdata = sessdata.trim();
        while (sessdata.length % 4 !== 0) {
            sessdata += '=';
        }
        
        return Buffer.from(sessdata, 'base64').toString('utf-8');
    } catch (error) {
        console.error('Error decoding session:', error);
        return null;
    }
}

async function saveSessionCreds(userId, sessionData) {
    const userDir = getUserSessionDir(userId);
    const credsPath = path.join(userDir, 'creds.json');
    
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    
    try {
        const jsonData = JSON.parse(sessionData);
        fs.writeFileSync(credsPath, JSON.stringify(jsonData, null, 2));
        return true;
    } catch (e) {
        fs.writeFileSync(credsPath, sessionData);
        return false;
    }
}

// ============ GROUP EVENTS HANDLER ============
const GroupEvents = async (conn, update) => {
    try {
        const { id, participants, action } = update;
        
        if (config.WELCOME === "true" && action === 'add') {
            for (const participant of participants) {
                try {
                    const groupMetadata = await conn.groupMetadata(id);
                    const groupName = groupMetadata.subject;
                    const userName = participant.split('@')[0];
                    
                    const welcomeMsg = `👋 Welcome to *${groupName}*!\n\n@${userName} thanks for joining us! 🎉`;
                    
                    await conn.sendMessage(id, { 
                        text: welcomeMsg,
                        mentions: [participant]
                    });
                } catch (e) {
                    console.error('Welcome error:', e);
                }
            }
        }
        
        if (config.GOODBYE === "true" && action === 'remove') {
            for (const participant of participants) {
                try {
                    const userName = participant.split('@')[0];
                    const goodbyeMsg = `👋 Goodbye @${userName}! We'll miss you. 😢`;
                    
                    await conn.sendMessage(id, { 
                        text: goodbyeMsg,
                        mentions: [participant]
                    });
                } catch (e) {
                    console.error('Goodbye error:', e);
                }
            }
        }
        
        // Admin actions
        if (config.ADMIN_ACTION === "true") {
            if (action === 'promote') {
                for (const participant of participants) {
                    await conn.sendMessage(id, { 
                        text: `🎉 Congratulations @${participant.split('@')[0]}! You are now an admin.`,
                        mentions: [participant]
                    });
                }
            }
            if (action === 'demote') {
                for (const participant of participants) {
                    await conn.sendMessage(id, { 
                        text: `😢 @${participant.split('@')[0]} has been demoted from admin.`,
                        mentions: [participant]
                    });
                }
            }
        }
    } catch (err) {
        console.error('GroupEvents error:', err);
    }
};

// ============ WHATSAPP CONNECTION ============

async function startUserSession(userId, sessionId, userName = '') {
    const existingConn = connections[userId];
    if (existingConn && existingConn.status === 'connected') {
        console.log(`[User ${userId}] Already connected`);
        return { success: false, error: 'Already connected' };
    }

    try {
        updateSessionStatus(userId, 'connecting');
        
        // Save session credentials
        const decodedData = decodeSessionId(sessionId);
        if (!decodedData) {
            throw new Error('Invalid SESSION_ID format');
        }
        
        await saveSessionCreds(userId, decodedData);
        
        const userDir = getUserSessionDir(userId);
        const { state, saveCreds } = await useMultiFileAuthState(userDir);
        
        const { version } = await fetchLatestBaileysVersion();
        
        const sock = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Firefox"),
            syncFullHistory: false,
            auth: state,
            version,
            getMessage: async () => ({})
        });

        // Store connection
        connections[userId] = {
            sock,
            status: 'connecting',
            userName,
            userId,
            startTime: Date.now()
        };

        // ============ CONNECTION UPDATE HANDLER ============
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            const connData = connections[userId];
            
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                connData.status = 'disconnected';
                updateSessionStatus(userId, 'disconnected');
                
                console.log(`[User ${userId}] Connection closed. Reconnect: ${shouldReconnect}`);
                
                if (shouldReconnect) {
                    setTimeout(() => startUserSession(userId, sessionId, userName), 5000);
                }
            } else if (connection === 'open') {
                connData.status = 'connected';
                updateSessionStatus(userId, 'connected');
                console.log(`[User ${userId}] Connected ✅`);
                
                // Send startup message
                try {
                    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    const botName = config.BOT_NAME || 'Bot';
                    
                    const upMessage = `*🤖 Bot Started Successfully!*\n\n` +
                        `*User:* ${userName || 'User ' + userId}\n` +
                        `*Status:* Online ✅\n` +
                        `*Plugins:* ${pluginCount} loaded\n` +
                        `*Commands:* ${events.commands.length} available\n` +
                        `*Started:* ${new Date().toLocaleString()}\n\n` +
                        `Your bot is ready to use!`;
                    
                    await sock.sendMessage(botJid, { 
                        text: upMessage 
                    });
                } catch (e) {
                    console.log(`[User ${userId}] Could not send startup message`);
                }
            }
            
            if (qr) {
                console.log(`[User ${userId}] QR code generated (should not happen with session)`);
            }
        });

        sock.ev.on('creds.update', saveCreds);
        
        // ============ GROUP EVENTS ============
        sock.ev.on("group-participants.update", (update) => GroupEvents(sock, update));
        
        // ============ MESSAGE HANDLER ============
        sock.ev.on('messages.upsert', async (mek) => {
            try {
                const msg = mek.messages[0];
                if (!msg.message) return;
                
                // Skip status broadcasts and newsletters
                if (msg.key.remoteJid === 'status@broadcast' || 
                    msg.key.remoteJid?.endsWith('@newsletter')) {
                    return;
                }
                
                const m = sms(sock, msg);
                const type = getContentType(msg.message);
                const body = (type === 'conversation') ? msg.message.conversation : 
                    (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : 
                    (type === 'imageMessage') ? msg.message.imageMessage.caption :
                    (type === 'videoMessage') ? msg.message.videoMessage.caption :
                    (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : '';
                
                // Command handling
                const prefix = config.PREFIX || '.';
                const isCmd = body && body.startsWith(prefix);
                
                if (isCmd) {
                    const command = body.slice(prefix.length).trim().split(' ').shift().toLowerCase();
                    const args = body.trim().split(/ +/).slice(1);
                    const q = args.join(' ');
                    
                    const from = msg.key.remoteJid;
                    const isGroup = from.endsWith('@g.us');
                    const sender = msg.key.fromMe ? 
                        (sock.user.id.split(':')[0]+'@s.whatsapp.net') : 
                        (msg.key.participant || msg.key.remoteJid);
                    
                    // Build context (same as old index.js)
                    const context = {
                        from,
                        quoted: [],
                        body,
                        isCmd: true,
                        command,
                        args,
                        q,
                        text: q,
                        isGroup,
                        sender,
                        senderNumber: sender.split('@')[0],
                        botNumber2: await jidNormalizedUser(sock.user.id),
                        botNumber: sock.user.id.split(':')[0],
                        pushname: msg.pushName || 'User',
                        isMe: true,
                        isOwner: true,
                        isCreator: true,
                        groupMetadata: isGroup ? await sock.groupMetadata(from).catch(() => null) : null,
                        groupName: '',
                        participants: '',
                        groupAdmins: [],
                        isBotAdmins: false,
                        isAdmins: true,
                        reply: (text) => sock.sendMessage(from, { text }, { quoted: msg }),
                        // Add all old context properties for compatibility
                        l: console.log,
                        mime: (msg.msg || msg).mimetype || '',
                        isReact: msg.message.reactionMessage ? true : false
                    };
                    
                    if (context.groupMetadata) {
                        context.groupName = context.groupMetadata.subject;
                        context.participants = context.groupMetadata.participants;
                        context.groupAdmins = getGroupAdmins(context.participants);
                        context.isBotAdmins = context.groupAdmins.includes(context.botNumber2);
                        context.isAdmins = context.groupAdmins.includes(sender);
                    }
                    
                    // ============ COMMAND EXECUTION ============
                    // Try to find command in loaded plugins
                    let cmd = events.commands.find((cmd) => cmd.pattern === command) || 
                              events.commands.find((cmd) => cmd.alias && cmd.alias.includes(command));
                    
                    if (cmd) {
                        try {
                            // Add react function if not present
                            if (!context.react && msg.key) {
                                context.react = (emoji) => sock.sendMessage(from, { 
                                    react: { text: emoji, key: msg.key } 
                                });
                            }
                            
                            // Execute command with full context
                            await cmd.function(sock, msg, m, context);
                        } catch (e) {
                            console.error(`[User ${userId}] Command error [${command}]:`, e);
                            context.reply('⚠️ Error executing command');
                        }
                    } else if (command === 'ping') {
                        context.reply('🏓 Pong! Bot is alive. Commands: ' + events.commands.length);
                    } else if (command === 'menu') {
                        // Simple menu command
                        let menuText = `*🤖 ${config.BOT_NAME || 'Bot'} Menu*\n\n`;
                        menuText += `*Total Commands:* ${events.commands.length}\n`;
                        menuText += `*Prefix:* ${prefix}\n\n`;
                        
                        // Group commands by category
                        const categories = {};
                        events.commands.forEach(cmd => {
                            const cat = cmd.category || 'misc';
                            if (!categories[cat]) categories[cat] = [];
                            categories[cat].push(cmd.pattern);
                        });
                        
                        for (const [cat, cmds] of Object.entries(categories)) {
                            menuText += `*${cat.toUpperCase()}*\n`;
                            menuText += cmds.join(', ') + '\n\n';
                        }
                        
                        context.reply(menuText);
                    }
                }
                
                // ============ NON-COMMAND EVENTS (on: body, text, image, etc.) ============
                events.commands.forEach(async (command) => {
                    try {
                        if (command.on === "body" && body) {
                            await command.function(sock, msg, m, {
                                from: msg.key.remoteJid,
                                body, isCmd, command, args, q, text: q,
                                isGroup: msg.key.remoteJid.endsWith('@g.us'),
                                sender, reply: (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg })
                            });
                        } else if (command.on === "text" && q) {
                            await command.function(sock, msg, m, {
                                from: msg.key.remoteJid,
                                body, isCmd, command, args, q, text: q,
                                isGroup: msg.key.remoteJid.endsWith('@g.us'),
                                sender, reply: (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg })
                            });
                        } else if ((command.on === "image" || command.on === "photo") && type === "imageMessage") {
                            await command.function(sock, msg, m, {
                                from: msg.key.remoteJid,
                                body, isCmd, command, args, q, text: q,
                                isGroup: msg.key.remoteJid.endsWith('@g.us'),
                                sender, reply: (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg })
                            });
                        } else if (command.on === "sticker" && type === "stickerMessage") {
                            await command.function(sock, msg, m, {
                                from: msg.key.remoteJid,
                                body, isCmd, command, args, q, text: q,
                                isGroup: msg.key.remoteJid.endsWith('@g.us'),
                                sender, reply: (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg })
                            });
                        }
                    } catch (e) {
                        console.error(`[User ${userId}] Event handler error:`, e);
                    }
                });
                
            } catch (err) {
                console.error(`[User ${userId}] Message handler error:`, err);
            }
        });

        return { success: true, userId, status: 'connecting' };
        
    } catch (error) {
        console.error(`[User ${userId}] Failed to start session:`, error);
        updateSessionStatus(userId, 'error');
        connections[userId] = { status: 'error', error: error.message };
        return { success: false, error: error.message };
    }
}

// ============ EXPRESS ROUTES ============

// Registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Register new session
app.post('/register', async (req, res) => {
    try {
        const { userName, sessionId } = req.body;
        
        if (!sessionId || sessionId.trim().length < 10) {
            return res.status(400).json({ error: 'Valid SESSION_ID is required' });
        }
        
        // Check if session already exists
        const existing = getAllSessions().find(s => s.session_id === sessionId);
        if (existing) {
            return res.status(409).json({ 
                error: 'This SESSION_ID is already registered',
                userId: existing.user_id 
            });
        }
        
        // Create session record
        const userId = createSession(userName, sessionId);
        
        // Start the session
        const result = await startUserSession(userId, sessionId, userName);
        
        if (result.success) {
            res.json({
                success: true,
                userId,
                status: 'connecting',
                message: 'Session started successfully',
                plugins: pluginCount,
                commands: events.commands.length
            });
        } else {
            // Clean up on failure
            deleteSession(userId);
            res.status(500).json({ error: result.error || 'Failed to start session' });
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all sessions status
app.get('/status', (req, res) => {
    const sessions = getAllSessions();
    const statusData = sessions.map(s => {
        const conn = connections[s.user_id];
        return {
            userId: s.user_id,
            userName: s.user_name,
            status: conn ? conn.status : s.status,
            createdAt: s.created_at,
            lastConnected: s.last_connected,
            prefix: s.prefix,
            uptime: conn && conn.startTime ? Date.now() - conn.startTime : null
        };
    });
    
    res.json({
        total: statusData.length,
        connected: statusData.filter(s => s.status === 'connected').length,
        plugins: pluginCount,
        commands: events.commands.length,
        sessions: statusData
    });
});

// HTML status page
app.get('/status/html', (req, res) => {
    const sessions = getAllSessions();
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bot Status</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            h1 { color: #333; }
            .stats { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
            table { width: 100%; background: white; border-radius: 10px; overflow: hidden; }
            th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #667eea; color: white; }
            .status-connected { color: green; font-weight: bold; }
            .status-disconnected { color: red; }
            .status-connecting { color: orange; }
        </style>
    </head>
    <body>
        <h1>🤖 ISHAQ-MD  Bot Status</h1>
        <div class="stats">
            <h3>Total Sessions: ${sessions.length}</h3>
            <h3>Connected: ${Object.values(connections).filter(c => c.status === 'connected').length}</h3>
            <h3>Plugins Loaded: ${pluginCount}</h3>
            <h3>Commands Available: ${events.commands.length}</h3>
        </div>
        <table>
            <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Connected</th>
            </tr>`;
    
    sessions.forEach(s => {
        const conn = connections[s.user_id];
        const status = conn ? conn.status : s.status;
        const statusClass = status === 'connected' ? 'status-connected' : 
                           status === 'connecting' ? 'status-connecting' : 'status-disconnected';
        
        html += `
            <tr>
                <td>${s.user_id}</td>
                <td>${s.user_name || 'Anonymous'}</td>
                <td class="${statusClass}">${status}</td>
                <td>${s.created_at}</td>
                <td>${s.last_connected || 'Never'}</td>
            </tr>`;
    });
    
    html += `</table></body></html>`;
    res.send(html);
});

// Delete session
app.delete('/session/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    // Disconnect if connected
    const conn = connections[userId];
    if (conn && conn.sock) {
        try {
            await conn.sock.logout();
        } catch (e) {}
    }
    delete connections[userId];
    
    // Remove session directory
    const userDir = getUserSessionDir(userId);
    if (fs.existsSync(userDir)) {
        fs.rmSync(userDir, { recursive: true, force: true });
    }
    
    // Remove from database
    deleteSession(userId);
    
    res.json({ success: true, message: 'Session deleted' });
});

// Health check
app.get('/', (req, res) => {
    res.redirect('/status/html');
});

// ============ INITIALIZATION ============

async function initializeAllSessions() {
    console.log('[Init] Loading all sessions from database...');
    const sessions = getAllSessions();
    
    for (const session of sessions) {
        console.log(`[Init] Starting session ${session.user_id}...`);
        await startUserSession(session.user_id, session.session_id, session.user_name);
        await sleep(3000); // Delay between connections to avoid rate limits
    }
    
    console.log(`[Init] Loaded ${sessions.length} sessions`);
}

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📋 Register new sessions at: http://localhost:${port}/register`);
    console.log(`📊 View status at: http://localhost:${port}/status/html`);
    
    // Initialize all saved sessions after server starts
    setTimeout(initializeAllSessions, 2000);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n[Shutdown] Closing all connections...');
    for (const [userId, conn] of Object.entries(connections)) {
        if (conn.sock) {
            try {
                await conn.sock.end();
            } catch (e) {}
        }
    }
    process.exit(0);
});
