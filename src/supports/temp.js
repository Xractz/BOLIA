let temp = [];
let result = null

const setTempData = async (data) => {
  temp.push(data);
}

const getTempData = (phoneNumber) => {
  const result = temp.find((data) => data.phoneNumber === phoneNumber);
  return result ? { room: result.room, time: result.time } : null;
};

const deleteTempData = (phoneNumber) => {
  temp = temp.filter((data) => data.phoneNumber !== phoneNumber);
};

module.exports = { setTempData, getTempData, deleteTempData };