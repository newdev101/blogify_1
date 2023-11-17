const jwt = require('jsonwebtoken');

const secret = "hello@rajat";

function createTokenForUser(user){
     const payload = {
          _id:user._id,
          fullName:user.fullName,
          email:user.email,
          profileImageURL:user.profileImageURL,
          role:user.role,
     };

  const token = jwt.sign(payload,secret);
  return token;
}

function valildateToken(token){
     const payload = jwt.verify(token,secret);
     return payload;
}

module.exports={
     createTokenForUser,
     valildateToken,
}