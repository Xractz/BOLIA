const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { turnitinStatus, turnitinUploadDocument } = require("../../../supports/fetch");
const { data, updateData } = require("../../../supports/database");
const { 
  getJid, 
  getMessageCaption, 
  sendMessageWTyping, 
  getPhoneNumber, 
  getFileName,
  getMimeType,
  isDocumentEligible 
} = require("../../../supports/message");
const pino = require("pino");
let onTitle = false,
  onTitleConfirmation = false,
  onDocument = false,
  uploadDocumentConfirmation = false,
  title = "",
  media,
  fileName,
  mimeType;

class Turnitin {
  async execute(sock, message) {
    try {
      const jid = getJid(message);
      const msg = getMessageCaption(message)
      const dataUser = await data(getPhoneNumber(message));
      const { npm } = dataUser;
      const response = await turnitinStatus(npm);
      
      if (msg === "1") {
        let text;
        if (!response) {
          await sendMessageWTyping(sock, jid, { text: "NPM anda tidak terdaftar di Turnitin 😓" });
        } else {
          text = `Status dokumen anda : ${response}`
          await sendMessageWTyping(sock, jid, { text });
        }

        text = "Silahkan pilih menu dibawah ini :\n\n1. Status\n2. Upload dokumen"
        return await sendMessageWTyping(sock, getJid(message), { text });
      }

      else if (msg === "2" || onTitle) {
        if (onTitle) {
          title = "";
          title += msg;
          onTitle = false;

          await sendMessageWTyping(sock, jid, { text: "Apakah anda yakin dengan judul anda (y/n)" });
          onTitleConfirmation = true;
        } else {
          await sendMessageWTyping(sock, jid, { text: "Masukkan judul dokumen anda" });
          onTitle = true;
        }
      }

      else if (onTitleConfirmation) {
        if (msg === "n") {
          await sendMessageWTyping(sock, jid, { text: "Masukkan judul dokumen anda" });
          onTitleConfirmation = false;
          onTitle = true;
        }
        else if (msg === "y") {
          await sendMessageWTyping(sock, jid, { text: "Unggah dokumen anda dengan format pdf/word" });
          onTitleConfirmation = false;
          onDocument = true;
        }
        else {
          await sendMessageWTyping(sock, jid, { text: "Maaf, BOLIA tidak mengerti perintahmu 😓\nSilahkan pilih opsi (y/n)" });
        }
      }

      else if (onDocument) {
        const isEligible = isDocumentEligible(message);

        if (isEligible) {
          media = await downloadMediaMessage(message, "buffer", {}, { pino, reuploadRequest: sock.updateMediaMessage });
          fileName = getFileName(message);
          mimeType = getMimeType(message);
          uploadDocumentConfirmation = true;
          await sendMessageWTyping(sock, jid, { text: "Apakah anda yakin dengan dokumen anda (y/n)" });
        }
        else if (uploadDocumentConfirmation) {
          if (msg === "n") {
            await sendMessageWTyping(sock, jid, { text: "Unggah dokumen anda dengan format pdf/word" });
            uploadDocumentConfirmation = false;
          } 
          else if (msg === "y") {
            await sendMessageWTyping(sock, jid, { text: "Mohon tunggu.. sedang mengunggah dokumen anda.." });

            try {
              const response = await turnitinUploadDocument(npm, title, media, fileName, mimeType);

              if (response) {
                await sendMessageWTyping(sock, jid, { text: response });
                await sendMessageWTyping(sock, jid, { text: "Terima kasih telah menggunakan layanan kami 🤗" });

                uploadDocumentConfirmation = false;
                onDocument = false;

                await updateData(getPhoneNumber(message), { history: "home" });
              }
              
            } catch (error) {
              await sendMessageWTyping(sock, jid, { text: "Maaf, terjadi kesalahan saat mengunggah dokumen anda 😓\n\nSilahkan mengunggah dokumen anda kembali" });

              onDocument = true;
              uploadDocumentConfirmation = false;

              console.error(error);
            }
          } else {
            await sendMessageWTyping(sock, jid, { text: "Maaf, BOLIA tidak mengerti perintahmu 😓\nSilahkan pilih opsi (y/n)" });
          }
        } else {
          return await sendMessageWTyping(sock, getJid(message), {
            text: "Maaf, BOLIA tidak dapat mengenali dokumen yang anda unggah 😓\n\nSilahkan unggah dokumen dengan format :\npdf/word",
          });
        }
      }
      else {
        return await sendMessageWTyping(sock, getJid(message), {
          text: "Maaf, BOLIA tidak mengerti perintahmu 😓\nSilahkan pilih menu yang tersedia\n\n_nb: masukkan angka saja ya 🤗_",
        });
      }
    } catch (error) {
      console.error(error);
    }
  } 
}

module.exports = new Turnitin();