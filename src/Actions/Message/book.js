const { isDate, date } = require("../../supports/validate");
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
            text: "Silahkan pilih waktu yang ingin kamu pesan : \n\n`1` 08.00 - 09.30 WIB\n`2` 09.30 - 11.00 WIB\n`3` 11.00 - 12.30 WIB\n`4` 12.30 - 14.00 WIB\n`5` 14.00 - 15.30 WIB\n`6` 15.30 - 17.00 WIB\n`7` 17.00 - 18.30 WIB",
          });
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