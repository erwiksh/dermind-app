const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  updateUserPassword,
} = require("../services/auth.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.register = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      password,
      avatar,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return errorResponse(
        res,
        "Name, email, and password are required",
        400
      );
    }

    const existingUser =
      await findUserByEmail(
        email
      );

    if (existingUser) {
      return errorResponse(
        res,
        "Email already registered",
        400
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const newUser =
      await createUser({
        name,
        email,
        password:
          hashedPassword,
      });

    return successResponse(
      res,
      "Register successful",
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message
    );

  }
};

exports.login = async (
  req,
  res
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const user =
      await findUserByEmail(
        email
      );

    if (!user) {
      return errorResponse(
        res,
        "Invalid credentials",
        401
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return errorResponse(
        res,
        "Invalid credentials",
        401
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN,
      }
    );

    return successResponse(
      res,
      "Login successful",
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      }
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message
    );

  }
};

exports.profile = async (
  req,
  res
) => {
  try {

    const user =
      await findUserById(
        req.user.id
      );

    return successResponse(
      res,
      "Profile retrieved",
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message
    );

  }
};

exports.updateProfile =
  async (
    req,
    res
  ) => {

    try {

      const {
        name,
        email,
        avatar
      } = req.body;

      if (
        !name ||
        !email
      ) {
        return errorResponse(
          res,
          "Name and email are required",
          400
        );
      }

      const updatedUser =
        await updateUserProfile(
          req.user.id,
          name,
          email,
          avatar
        );

      return successResponse(
        res,
        "Profile updated successfully",
        updatedUser
      );

    } catch (error) {

      return errorResponse(
        res,
        error.message
      );

    }

  };
exports.changePassword =
  async (
    req,
    res
  ) => {

    try {

      const {
        oldPassword,
        newPassword
      } = req.body;

      if (
        !oldPassword ||
        !newPassword
      ) {
        return errorResponse(
          res,
          "All fields are required",
          400
        );
      }

      const user =
        await findUserById(
          req.user.id
        );

      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {

        return errorResponse(
          res,
          "Password lama salah",
          400
        );

      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      await updateUserPassword(
        user.id,
        hashedPassword
      );

      return successResponse(
        res,
        "Password berhasil diubah"
      );

    } catch (error) {

      return errorResponse(
        res,
        error.message
      );

    }

  };