const { isClient, getPhoneNumber, setTimer } = require("../supports/message");
const { historyHandler, Handlers } = require("../config/history");
const { checkData, createData, getRawData, updateData } = require("../supports/database");

class ResolveMessageAction {
  async execute(sock, messages) {
    try {
      for (const message of messages){
        if (!isClient(message)) return;
        
        if (!(await checkData(getPhoneNumber(message), "phoneNumber")))
        {
          await createData(getRawData(getPhoneNumber(message)));
        }

        await updateData(getPhoneNumber(message), { timer: setTimer(message) });

        const history = await checkData(getPhoneNumber(message), "history");
        if (await checkData(getPhoneNumber(message), "status") === "online" || history === "home")
        {
          for (const handler in historyHandler)
          {
            if (handler === history)
            {
              await Handlers.execute(sock, message, history);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = ResolveMessageAction;