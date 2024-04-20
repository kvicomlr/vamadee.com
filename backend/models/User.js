import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
const bcryptSalt = process.env.BCRYPT_SALT;
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email required."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email required."],
    },
    password: {
      type: String,
      required: [true, "Password required.."],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm  password required."],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password & Confirm Password don't match!",
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    pswdChangedAt: Date,
    pswdResetToken: String,
    pswdResetTokenExpries: Date,
    firstName: {
      type: String,
      required: [true, "Please enter a first name."],
      validate: [validator.isAlpha, "Please enter only letters (a-zA-Z)."],
    },
    lastName: {
      type: String,
      required: [true, "Please enter a last name."],
      validate: [validator.isAlpha, "Please enter only letters (a-zA-Z)"],
    },
    photo: String,
    role: {
      type: String,
      enum: ["customer", "agent", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

//Password Hashing
userSchema.pre("save", async function (next) {
  //if password is not modified, don't encrypt it
  if (!this.isModified("password")) return next();

  //Encrypt password before saving it
  this.password = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.confirmPassword = undefined;
  next();
});

//Get only active users from the database with any query starting with find
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});
// #################################################################################
//Compare password received from the req.body to the password in the database
userSchema.methods.comparePWD = async function (pswdUser, pswdDB) {
  return await bcrypt.compare(pswdUser, pswdDB);
};
// #################################################################################
//Check if user login with token has change password
userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    /*  console.log(
      `pswdChangedTimestamp: ${pswdChangedTimestamp}, JWTTimestamp: ${JWTTimestamp}`
    ); */

    return JWTTimestamp < pswdChangedTimestamp;
  }
  return false;
};
// #################################################################################
userSchema.methods.createPswdResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.pswdResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.pswdResetTokenExpries = Date.now() + 10 * 60 * 1000;

  // console.log(resetToken, this.pswdResetToken);
  return resetToken;
};
// #################################################################################
const User = mongoose.model("User", userSchema);

export default User;
