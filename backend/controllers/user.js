import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

//function to handle single user profile update
const filterUserProfile = (userProfile, ...fieldsToUpdate) => {
  const updatedProfile = {};
  Object.keys(userProfile).forEach((e) => {
    if (fieldsToUpdate.includes(e)) updatedProfile[e] = userProfile[e];
  });
  return updatedProfile;
};

//function to handle sign token
const jwtSign = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
// ########################################################################
//@desc Update Password
//route   POST /api/v1/users/update_password
//@access Public
export const updatePswd = async (req, res, next) => {
  try {
    //GET CURRENT USER DATA FROM DBASE
    const user = await User.findById(req.user.id).select("+password");
    console.log(`User ID: ${user._id}`);

    //CHECK IF SUPPLIED CURRENT PASSWORD IS CORRECT
    if (!(await user.comparePWD(req.body.currentPWD, user.password)))
      return next(
        createError(401, "The current password you enter is invalid.")
      );

    //UPDATE USER PASSWORD WITH NEW VALUE
    (user.password = req.body.password),
      (user.confirmPassword = req.body.confirmPassword),
      await user.save();

    //LOGIN USER & SEND JWT

    const token = jwtSign(user._id, user.role);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 86_400_000,
      })
      .status(201)
      .json({
        success: true,
        message: "Password updated successful.",
      });
  } catch (err) {
    next(err);
  }
};
// ########################################################################
//UPDATE  PROFILE
export const updateProfile = async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  try {
    //CHECK IF REQUEST DATA CONTAIN PASSWORD || CONFIRM PASSWORD
    if (password || confirmPassword)
      return next(createError(400, "Your password can't be updated here!"));

    //UPDATE USER PROFILE
    const newProfile = filterUserProfile(
      req.body,
      "email",
      "firstName",
      "lastName",
      "photo"
    );
    const user = await User.findByIdAndUpdate(req.user.id, newProfile, {
      runValidators: true,
      new: true,
    }).select("+password");

    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// ########################################################################
//MAKE  PROFILE INACTIVE
export const deActivateProfile = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "success",
      message: "User profile deactivated successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

/* export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}; */

// ########################################################################
//DELETE PROFILE
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};
// ########################################################################
//GET PROFILE
export const getUser = async (req, res, next) => {
  try {
    const userProfile = await User.findById(req.params.id);
    res.status(200).json(userProfile);
  } catch (err) {
    next(err);
  }
};
// ########################################################################
//GET ALL USERS
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};
