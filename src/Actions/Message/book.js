const { isDate, date } = require("../../supports/validate");
const Temp = require("../../supports/temp");
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
          text: "Maaf, format tanggal yang kamu masukkan salah 😓\nSilahkan masukkan tanggal dengan format :\n\n`ddmmyyyy`\n\nex: `01042024`\n\n> Silahkan masukkan tanggal yang sesuai",
        });
      }
      else if (isDate(msg)){
        await sendMessageWTyping(sock, getJid(message), {
          text: "Mohon tunggu sebentar ya, sedang mencari ruang yang tersedia... 🕵️‍♂️"
        });

        const { availableRoom, rooms } = await available(msg);
        let tmpRoom = "", listRoom = [], i = 1;
        for (const room in rooms) {
          tmpRoom += `\`${i}\` ${room}\n`
          listRoom.push(room);
          i++;
        }
        await Temp.createData({ phoneNumber: getPhoneNumber(message), rooms, listRoom });
        
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