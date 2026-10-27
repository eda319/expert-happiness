import express from "express";
import helmet from "helmet";
import bcrypt from "bcryptjs"
import watchlistRoutes from "./routes/watchlist.js";
import { findByUsername } from "./utils/db.js"
import { signToken } from "./utils/tokenHelper.js";

const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());

app.use

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Missing credentials"
    })
  };

  const user = findByUsername(username)
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    })
  };

  const matched = await bcrypt.compare(password, user.passwordHash)
  if (!matched) {
    return res.status(401).json({
      message: "Invalid credentials"
    })
  };

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });
  res.json({ message: "Login successful", token });
})

app.use("/api/watchlist", watchlistRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
