const { updateData } = require("../../supports/database");
const { getTempData } = require("../../supports/temp");
const { isValidInput } = require("../../supports/validate");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../supports/message");
class Room {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);
      const { room, time } = getTempData(getPhoneNumber(message));

      if (isValidInput(msg, room)) {
        let tmpTime = "",
        i = 1;
        time.forEach((time) => {
          tmpTime += `\`${i}\` ${time}\n`;
          i++;
        });
        await sendMessageWTyping(sock, getJid(message), {
          text: `Silahkan pilih waktu yang ingin kamu pesan : \n\n${tmpTime}`,
        });
        return await updateData(getPhoneNumber(message), { history: "time", room: room[msg - 1] });
      }
      else {
        await sendMessageWTyping(sock, getJid(message), {
          text: `Maaf, ruang yang kamu pilih tidak sesuai\nSilahkan pilih ruang yang tersedia (1-${room.length})`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Room();