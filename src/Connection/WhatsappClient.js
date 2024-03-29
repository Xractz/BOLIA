const WhatsappConnection = require("./WhatsappConnection");

class WhatsappClient {
  constructor() {
    this.connection = new WhatsappConnection();
  }

  async start() {
    await this.connection.connectWhatsapp();
  }
}

module.exports = WhatsappClient;