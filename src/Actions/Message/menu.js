const { updateData, checkData, onDB } = require("../../supports/database");
const { available, getNPM } = require("../../supports/fetch");
const { isID } = require("../../supports/validate");
const { 
  sendMessageWTyping, 
  getMessageCaption, 
  getPhoneNumber, 
  getJid
} = require("../../supports/message");
var msgCount = 1,
  onFetch,
  data;

class Menu {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);

      if (await onDB(getPhoneNumber(message))) { msgCount = 2 }

      if (msgCount === 2) {
        if(!await onDB(getPhoneNumber(message)))
        {
          if (!isID(msg)) {
            return await sendMessageWTyping(sock, getJid(message), {
              text: "Maaf, sepertinys NPM/NPP yang kamu masukkan salah 😓\nSilahkan masukkan NPM/NPP yang benar",
            });
          }
          await sendMessageWTyping(sock, getJid(message), {
            text: "Mohon tunggu sebentar ya, sedang mencari NPM/NPP anda... 🕵️‍♂️"
          });
          data = await getNPM(msg);
          onFetch = data.name;
        }
        
        if (onFetch || await onDB(getPhoneNumber(message))) {
          const name = await checkData(getPhoneNumber(message), "name") || data.name;
          const npm = await checkData(getPhoneNumber(message), "npm") || data.npm;
          await updateData(getPhoneNumber(message), { name, npm });
          
          const text = onFetch ? `Halo, ${onFetch}\n\nSilahkan pilih tanggal yang ingin kamu pesan dengan mengetikkan tanggal dengan format :\n\n\`ddmmyyyy\`\n\nex: \`01042024\`` : `Silahkan pilih tanggal yang ingin kamu pesan dengan mengetikkan tanggal dengan format :\n\n\`ddmmyyyy\`\n\nex: \`01042024\``;
          
          await sendMessageWTyping(sock, getJid(message), { text });
          await updateData(getPhoneNumber(message), { history: "book" });
        }
        else {
          const text = "Maaf, NPM/NPP yang kamu masukkan tidak terdaftar 😓\nSilahkan masukkan NPM/NPP yang benar";
          await sendMessageWTyping(sock, getJid(message), { text });
        }
      }

      if (msg === "1")
      {
        await sendMessageWTyping(sock, getJid(message), {
          text: "BOLIA sedang mencari ruang yang tersedia 🕵️‍♂️\n\nMohon tunggu sebentar ya..."
        });
        await sendMessageWTyping(sock, getJid(message), {
          text: `Ruang yang tersedia : \n\n${await available()}`
        });
        if (await onDB(getPhoneNumber(message))) {
          msgCount = 2;
        } else {
          await sendMessageWTyping(sock, getJid(message), {
            text: "Masukkan NPM/NPP anda :",
          });
          msgCount++;
        }
      }
      else if (msg === "2")
      {
        if (await onDB(getPhoneNumber(message)))
        {
          msgCount = 2;
        }
        else
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: "Masukkan NPM/NPP anda :",
          });
          msgCount++;
        }
      }
      else if (msgCount === 1 && msg !== "1" && msg !== "2")
      {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Maaf, BOLIA tidak mengerti perintahmu 😓\nSilahkan pilih menu yang tersedia\n\n_nb: masukkan angka saja ya 🤗_",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Menu();