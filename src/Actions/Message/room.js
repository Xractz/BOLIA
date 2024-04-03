const { updateData } = require("../../supports/database");
const Temp = require("../../supports/temp");
const { isValidInput } = require("../../supports/validate");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../supports/message");
class Room {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);
      const { rooms, listRoom } = await Temp.readList(getPhoneNumber(message));

      if (isValidInput(msg, listRoom)) {
        let tmpTime = "", listTime = [], i = 1;
        rooms[listRoom[msg - 1]].forEach((time) => {
          tmpTime += `\`${i}\` ${time}\n`;
          listTime.push(time);
          i++;
        });
        await Temp.updateData(getPhoneNumber(message), { listTime });
        await sendMessageWTyping(sock, getJid(message), {
          text: `Silahkan pilih waktu yang ingin kamu pesan : \n\n${tmpTime}`,
        });
        return await updateData(getPhoneNumber(message), { history: "time", room: listRoom[msg - 1] });
      } else {
        await sendMessageWTyping(sock, getJid(message), {
          text: `Maaf, ruang yang kamu pilih tidak sesuai\nSilahkan pilih ruang yang tersedia (1-${listRoom.length})`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Room();