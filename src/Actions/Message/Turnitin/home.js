const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { turnitinStatus, turnitinUploadDocument } = require("../../../supports/fetch");
const { data, updateData } = require("../../../supports/database");
const { 
  getJid, 
  getMessageCaption, 
  sendMessageWTyping, 
  getPhoneNumber, 
  isDocumentEligible 
} = require("../../../supports/message");
const FormData = require("form-data");
const fetch = require("node-fetch-commonjs");
const pino = require("pino");
let onTitle = false,
  onTitleConfirmation = false,
  onDocument = false,
  uploadDocumentConfirmation = false,
  title = "",
  media = "";

class Turnitin {
  async execute(sock, message) {
    try {
      const jid = getJid(message);
      const msg = getMessageCaption(message)
      const dataUser = await data(getPhoneNumber(message));
      const { npm } = dataUser;
      const response = await turnitinStatus(npm);
      
      if (msg === "1") {
        let text = `Status dokumen anda : ${response}`
        await sendMessageWTyping(sock, jid, { text })
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
          media += await downloadMediaMessage(message, "buffer", {}, { pino, reuploadRequest: sock.updateMediaMessage });
          uploadDocumentConfirmation = true;
          await sendMessageWTyping(sock, jid, { text: "Apakah anda yakin dengan dokumen anda (y/n)" });
        }
        else if (uploadDocumentConfirmation) {
          if (msg === "n") {
            await sendMessageWTyping(sock, jid, { text: "Unggah dokumen anda dengan format pdf/word" });
            uploadDocumentConfirmation = false;
            media = "";
          } 
          else if (msg === "y") {
            await sendMessageWTyping(sock, jid, { text: "Mohon tunggu.. sedang mengunggah dokumen anda.." });

            try {
              const uploadUrl = "https://lib-uajy.vercel.app/turnitin";

              const formData = new FormData();
              formData.append("file", media);
              formData.append("npm", npm);
              formData.append("title", title);

              const options = {
                method: "POST",
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                body: formData,
              };

              const response = await fetch(uploadUrl, options);
              const responseData = await response.json();
              console.log("Upload successful:", responseData);

              return responseData;
            } catch (error) {
              console.error("There has been a problem with your fetch operation:", error.message);
              console.log("Upload successful:", responseData);
            }
            // await turnitinUploadDocument(npm, title, media);
            uploadDocumentConfirmation = false;
            onDocument = false;
          } else {
            await sendMessageWTyping(sock, jid, { text: "Maaf, BOLIA tidak mengerti perintahmu 😓\nSilahkan pilih opsi (y/n)" });
          }
        }
        else {
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