import express from "express";
import createError from "http-errors";

import UsersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  console.log("📨 PING - POST REQUEST");
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  console.log("📨 PING - GET REQUEST");
  try {
    const users = await UsersModel.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// usersRouter.get(
//   "/googleLogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// usersRouter.get(
//   "/googleRedirect",
//   passport.authenticate("google"),
//   async (req, res, next) => {
//     try {
//       console.log("Token: ", req.user.token);

//       if (req.user.role === "Admin") {
//         res.redirect(
//           `${process.env.FE_URL}/adminDashboard?accessToken=${req.user.token}`
//         );
//       } else {
//         res.redirect(
//           `${process.env.FE_URL}/profile?accessToken=${req.user.token}`
//         );
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );

usersRouter.get("/:userId", async (req, res, next) => {
  console.log("📨 PING - GET REQUEST");
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  console.log("📨 PING - PUT REQUEST");
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  console.log("📨 PING - DELETE REQUEST");
  try {
    const deletedUser = await UsersModel.findByIdAndUpdate(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
