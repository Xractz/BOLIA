const { updateData, checkData, onDB } = require("../../supports/database");
const { getNPM } = require("../../supports/fetch");
const { isID } = require("../../supports/validate");
const { getDate } = require("../../supports/message");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../supports/message");
var onNPM = false,
  onFetch,
  isTurnitin,
  data;

class Menu {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);

      if (msg === "1" || msg === "2") {
        if (await onDB(getPhoneNumber(message))) {
          onNPM = true;
          isTurnitin = msg === "2" ? true : false;
        } else {
          isTurnitin = msg === "2" ? true : false;
          await sendMessageWTyping(sock, getJid(message), {
            text: "Masukkan NPM/NPP anda :",
          });
          return (onNPM = true);
        }
      } else if (!onNPM && msg != "1" && msg != "2") {
        return await sendMessageWTyping(sock, getJid(message), {
          text: "Maaf, BOLIA tidak mengerti perintahmu 😓\nSilahkan pilih menu yang tersedia\n\n_nb: masukkan angka saja ya 🤗_",
        });
      }

      if (onNPM) {
        if (!(await onDB(getPhoneNumber(message)))) {
          if (!isID(msg)) {
            return await sendMessageWTyping(sock, getJid(message), {
              text: "Maaf, sepertinya NPM/NPP yang kamu masukkan salah 😓\n\n> Silahkan masukkan NPM/NPP yang benar",
            });
          }

          await sendMessageWTyping(sock, getJid(message), {
            text: "Mohon tunggu sebentar ya, sedang mencari NPM/NPP anda... 🕵️‍♂️",
          });
          data = await getNPM(msg);
          onFetch = data.name;
        }

        if (onFetch || (await onDB(getPhoneNumber(message)))) {
          const name = (await checkData(getPhoneNumber(message), "name")) || data.name;
          const npm = (await checkData(getPhoneNumber(message), "npm")) || data.npm;
          await updateData(getPhoneNumber(message), { name, npm });

          if (isTurnitin) {
            const text = onFetch ? `Halo, ${onFetch}\n\nSilahkan pilih menu dibawah ini :\n\n1. Status\n2. Upload dokumen` : `Silahkan pilih menu dibawah ini :\n\n1. Status\n2. Upload dokumen\n\n> nb: _Pengecekan dokumen akan dilakukan pada jam kerja UAJY._`;
            await sendMessageWTyping(sock, getJid(message), { text });

            return await updateData(getPhoneNumber(message), { history: "Thome" });
          }

          const text = onFetch
            ? `Halo, ${onFetch}\n\nSilahkan pilih tanggal yang ingin kamu pesan dengan mengetikkan tanggal dengan format :\n\n\`ddmmyyyy\`\n\nex: \`${getDate(message).replace(/\//g, "").padStart(2,'0')}\``
            : `Silahkan pilih tanggal yang ingin kamu pesan dengan mengetikkan tanggal dengan format :\n\n\`ddmmyyyy\`\n\nex: \`${getDate(message).replace(/\//g, "").padStart(2,'0')}\``;

          await sendMessageWTyping(sock, getJid(message), { text });
          await updateData(getPhoneNumber(message), { history: "book" });
          return (onNPM = false);
        } else {
          const text = "Maaf, NPM/NPP yang kamu masukkan tidak terdaftar di Database LIB UAJY 😓\n\n> Silahkan masukkan NPM/NPP yang lain";
          await sendMessageWTyping(sock, getJid(message), { text });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Menu();
