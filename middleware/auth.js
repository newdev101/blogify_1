const { valildateToken } = require("../services/auth");

// function checkForAuthenticationCookie(cookieName) {
//   return (req, res, next) => {
//     const tokenCookieValue = req.cookies[cookieName];
//     if (!tokenCookieValue) {
//       next();
//     }

//     try {
//       const userPayload = valildateToken(tokenCookieValue);
//       req.user = userPayload;
//       next();
//     } catch (error) {
//       next();
//     }
//   };
// }

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    
    try {
      if (tokenCookieValue) {
        // console.log(tokenCookieValue);
        const userPayload = valildateToken(tokenCookieValue);
        // console.log(userPayload);
        req.user = userPayload;
      }
    } catch (error) {
      console.log(error);
      // Handle the error if needed, but continue to the next middleware
    }
    console.log("middleware=checkauth")
    // console.log(req.user);

    next(); // Continue to the next middleware
  };
}


module.exports={
     checkForAuthenticationCookie,
}
