import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(
    //1st param: accepts a function as the paylod, which contains the claims.
    //Claims are statements about an entity (typically, the user) and additional data.
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    //2nd param: Signature
    //To create the signature part you have to take the encoded header,
    //the encoded payload, a secret, the algorithm specified in the header, and sign that.
    process.env.JWT_SECRET,
    //3rd param: options for signin token
    {
      expiresIn: '30d',
    }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
        //401: unauthorized code
      } else {
        req.user = decode;
        //decode constains the user id, name, email and isAdmin
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token is not suppiled' });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'User is not admin' });
  }
};

export { signToken, isAuth, isAdmin };
