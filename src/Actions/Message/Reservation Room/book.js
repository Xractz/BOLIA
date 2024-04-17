const Temp = require("../../../supports/temp");
const { isDate, date } = require("../../../supports/validate");
const { updateData } = require("../../../supports/database");
const { available } = require("../../../supports/fetch");
const { getDateValid, getDate } = require("../../../supports/message");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../../supports/message");

class Book {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);
      const text =
        isDate(msg) === "Wrong day!"
          ? `Maaf, tanggal yang kamu masukkan salah 😓\n\n> Masukkan tanggal diatas tanggal : ${getDateValid(message)}`
          : isDate(msg) === "Wrong format!"
          ? `Maaf, format tanggal yang kamu masukkan salah 😓\nMasukkan tanggal dengan format :\n\n\`ddmmyyyy\`\n\nex: \`${getDate(message).replace(/\//g, "").padStart(2, "0")}\``
          : isDate(msg) === "Wrong date!"
          ? `Maaf, format tanggal yang kamu masukkan salah 😓\n\n> Cek kembali tanggal, bulan, dan tahun anda.\n> Silahkan masukkan tanggal diatas tanggal : ${getDateValid(message)}`
          : `Maaf, format tanggal yang kamu masukkan salah 😓\nMasukkan tanggal dengan format :\n\n\`ddmmyyyy\`\n\nex: \`${getDate(message).replace(/\//g, "").padStart(2, "0")}\``;

      if (isDate(msg) !== "Eligible") {
        await sendMessageWTyping(sock, getJid(message), { text });
      } else if (isDate(msg) === "Eligible") {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Mohon tunggu sebentar ya, sedang mencari ruang yang tersedia... 🕵️‍♂️",
        });

        const { availableRoom, rooms } = await available(msg);
        let tmpRoom = "",
          listRoom = [],
          i = 1;
        for (const room in rooms) {
          tmpRoom += `\`${i}\` ${room}\n`;
          listRoom.push(room);
          i++;
        }
        await Temp.createData({ phoneNumber: getPhoneNumber(message), rooms, listRoom });

        if (availableRoom) {
          await sendMessageWTyping(sock, getJid(message), {
            text: `Ruang yang tersedia :\n\n📅 ${date(msg, true)}\n\n${availableRoom}`,
          });
          await sendMessageWTyping(sock, getJid(message), {
            text: `Silahkan pilih ruang yang ingin kamu pesan : \n\n${tmpRoom}`,
          });
          await updateData(getPhoneNumber(message), { history: "room", date: date(msg) });
        } else {
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
