import express from "express"
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import * as utils from "../utils/db.js"
const router = express.Router();

router.use(authenticate)

router.get("/:userId", (req, res) => {
  const { userId } = req.params
  const watchlist = utils.getWatchlist(Number(userId))
  return res.status(200).json({
    watchlist
  })
})

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const { userId } = req.params;
  utils.addMovie(Number(userId), req.body)
  res.status(201).json({
    message: "Movie successfully added"
  })
})

router.route("/:userId/movies/:movieId")
  .put(authorizeModification, (req, res) => {
    const { userId, movieId } = req.params;
    utils.updateMovie(Number(userId), Number(movieId), req.body)
    res.status(200).json({
      message: "Movie successfully updated"
    })
  })
  .delete(authorizeModification, (req, res) => {
    const { userId, movieId } = req.params;
    utils.deleteMovie(Number(userId), Number(movieId))
    res.status(200).json({
      message: "Movie successfully deleted"
    })
  })

export default router
