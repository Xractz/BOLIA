const ResolveMessageAction = require("../Actions/ResolveMessageAction");
const pino = require("pino");
const { TimeoutClient } = require("../config/timeoutclient");
const {
  makeWASocket, 
  useMultiFileAuthState, 
  fetchLatestWaWebVersion, 
  makeCacheableSignalKeyStore 
} = require("@whiskeysockets/baileys");

class WhatsappConnection {
  async connectWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState("./src/session");
    const { version, isLatest } = await fetchLatestWaWebVersion();
    this.sock = makeWASocket({
      logger: pino({ level: "silent" }),
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ["LIB UAJY", "Chrome", "20.0.04"],
      version,
      generateHighQualityLinkPreview: true,
      linkPreviewImageThumbnailWidth: 192,
    });

    this.sock.ev.on("creds.update", await saveCreds);
    this.sock.ev.on("connection.update", async ({ connection }) => {
      if (connection === "close") {
        await this.connectWhatsapp();
      } else if (connection === "open") {
        console.log("Connected to", this.sock.user.id.split(":")[0]);
        this.startInterval();
      }
    });
    this.resolveMessageUpsert();
  }

  resolveMessageUpsert() {
    this.sock.ev.on("messages.upsert", ({ messages }) => new ResolveMessageAction().execute(this.sock, messages));
  }

  startInterval() {
    setInterval(async () => {
      await TimeoutClient.execute(this.sock);
    }, 1000);
  }
}

module.exports = WhatsappConnection;
