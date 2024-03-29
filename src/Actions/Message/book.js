const { isDate, date } = require("../../supports/validate");
const { updateData } = require("../../supports/database");
const { available } = require("../../supports/fetch");
const { 
  sendMessageWTyping,
  getMessageCaption,
  getPhoneNumber,
  getJid
} = require("../../supports/message");

class Book {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);

      if (!isDate(msg)) {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Maaf, format tanggal yang kamu masukkan salah 😓\nSilahkan masukkan tanggal dengan format :\n\n`ddmmyyyy`\n\nex: `01042024`",
        });
      }
      else if (isDate(msg)){
        const availableRoom = await available(msg);
        if (availableRoom)
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: `Ruang yang tersedia :\n\n📅 ${date(msg, true)}\n\n${availableRoom}`
          });
          await sendMessageWTyping(sock, getJid(message), {
            text: "Silahkan pilih ruang yang ingin kamu pesan : \n\n`1` Discussion Room 1\n`2` Discussion Room 2\n`3` Discussion Room 3\n`4` Leisure Room 1",
          });
          await updateData(getPhoneNumber(message), { history: "room", date: date(msg) });
        }
        else
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: `Tidak ada ruang dan waktu yang tersedia pada ${date(msg, true)}`,
          });
        }
      }

      
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Book();