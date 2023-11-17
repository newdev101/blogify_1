const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const {createTokenForUser} = require('../services/auth');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    email:{
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    salt: {
      type: String,
     //  required: true,
    },
  },
  { timestamps: true }
);


//pre unction in mongoose
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  // const salt = "rajat@2023";
  const hashedPassword = createHmac('sha256', salt)
               .update(user.password) //don't put ' '  because it will treated as a string
               .digest('hex');
  this.salt=salt;
  this.password=hashedPassword;
  next();
});


//virtual function in mongoose to verify password 

userSchema.static('matchPasswordAndGenerateToken',async function(email, password) {
    const user =await this.findOne({email});
    if(!user) throw new Error("user not found");

    console.log(user);

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
    .update(password) //use the variable name
    .digest('hex');

    if(hashedPassword!==userProvidedHash) throw new Error("wrong password");

    const token = createTokenForUser(user);
    // console.log("token d",token);
    return token;
 });
const User = model("user", userSchema);

module.exports = User;
