import express from "express";
import createError from "http-errors";
import UsersModel from "./model.js";
import AccommodationModel from "../accomodation/model.js";

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
    const users = await UsersModel.find({}).populate({
      path: "accommodations",
    });
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

usersRouter.post("/:userId/accommodations", async (req, res, next) => {
  console.log(`📨 PING - POST ACCOMMODATION FOR USER: ${req.params.userId} `);

  try {
    //retrieve accommodationId from the req body
    const { accommodationId } = req.body;

    //0 Does user exist?
    const user = await UsersModel.findById(req.params.userId);
    if (!user) {
      return next(
        createError(404, `User with id ${req.params.userId} not found`)
      );
    }
    //1 Does accommodation exist ?
    const accommodation = await AccommodationModel.findById(accommodationId);
    if (!accommodation) {
      return next(
        createError(
          404,
          `Accommodation with id ${req.params.accommodationId} not found`
        )
      );
    }

    //2 Is the accommodation already booked ?
    // !!! this is not working -- returning null
    const isAccommodationBooked = await UsersModel.findOne({
      _id: req.params.userId,
      "accommodations._id": accommodation._id,
    });

    console.log(isAccommodationBooked);

    if (isAccommodationBooked) {
      // 3.1 If it's booked, remove it
      const modifiedAccommodations = await UsersModel.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { accommodations: { _id: accommodationId } } },
        { new: true }
      );
      res.send(modifiedAccommodations);
    } else {
      //3.2 If it's not booked - add it to accommodations: []
      const modifiedAccommodations = await UsersModel.findByIdAndUpdate(
        { _id: req.params.userId }, // WHAT we want to modify
        { $push: { accommodations: { _id: accommodationId } } }, // HOW we want to modify the record
        {
          new: true, // OPTIONS
          upsert: true, // if the accommodation of this user is not found --> just create it automagically please
        }
      );
      res.send(modifiedAccommodations);
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
