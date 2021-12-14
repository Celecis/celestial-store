import db from './db';

const getError = (err) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;

const onError = async (err, req, res, next) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString() });
  //500 is the ERROR IN SERVER SIDE Status Code
};

export { getError, onError };
