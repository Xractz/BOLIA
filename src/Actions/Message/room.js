const { updateData } = require("../../supports/database");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../supports/message");

class Room {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);
      const roomHandler = {
        "1": "Discussion Room 1",
        "2": "Discussion Room 2",
        "3": "Discussion Room 3",
        "4": "Leisure Room 1"
      };

      if (msg in roomHandler) {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Silahkan pilih waktu yang ingin kamu pesan : \n\n`1` 08.00 - 09.30 WIB\n`2` 09.30 - 11.00 WIB\n`3` 11.00 - 12.30 WIB\n`4` 12.30 - 14.00 WIB\n`5` 14.00 - 15.30 WIB\n`6` 15.30 - 17.00 WIB\n`7` 17.00 - 18.30 WIB",
        });
        return await updateData(getPhoneNumber(message), { history: "time", room: roomHandler[msg] });
      } else if (msg != "1" || msg != "2" || msg != "3" || msg != "4") {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Maaf, ruang yang kamu pilih tidak sesuai\nSilahkan pilih ruang yang tersedia (1-4)",
        });
      }
      
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Room();
