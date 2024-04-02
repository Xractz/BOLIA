const { isDate, date } = require("../../supports/validate");
const { setTempData } = require("../../supports/temp");
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
        await sendMessageWTyping(sock, getJid(message), {
          text: "Mohon tunggu sebentar ya, sedang mencari ruang yang tersedia... 🕵️‍♂️"
        });

        const { availableRoom, room, time } = await available(msg);
        setTempData({ phoneNumber: getPhoneNumber(message), room, time });
        let tmpRoom = "", i = 1;
        room.forEach((room) => {
          tmpRoom += `\`${i}\` ${room}\n`
          i++;
        });
        
        if (availableRoom)
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: `Ruang yang tersedia :\n\n📅 ${date(msg, true)}\n\n${availableRoom}`
          });
          await sendMessageWTyping(sock, getJid(message), {
            text: `Silahkan pilih ruang yang ingin kamu pesan : \n\n${tmpRoom}`,
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