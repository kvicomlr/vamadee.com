import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = data;
  });

  const user = await User.findById(req.user.id);
  if (!user)
    return next(createError(401, "User with this  token does not exist!"));

  const isPasswordChanged = await user.isPasswordChanged(req.user.iat);
  if (isPasswordChanged) {
    return next(
      createError(
        401,
        "Password has been changed recently. Please login again!"
      )
    );
  }
  next();
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return next(
        createError(403, "You do not have permission to perform this action!")
      );
    }
  });
};

//For single role

/* export const verifyAdmin = (role) => {
  return (req, res, next) => {
    const isAdmin = req.user.role !== role;
    if (isAdmin) {
      return next(
        createError(403, "You do not have permission to perform this action!")
      );
    }
    next()
  };
}; */

//For multiple roles
/* export const verifyAdmin = (...role) => {
  return (req, res, next) => {
    const isAdmin = !role.inclues(req.user.role);
    if (isAdmin) {
      return next(
        createError(403, "You do not have permission to perform this action!")
      );
    }
        next()
  };
}; */
