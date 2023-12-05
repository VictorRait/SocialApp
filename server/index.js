import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import {register} from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import {verifyToken} from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/index.js";
const app = express();
dotenv.config();
// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "./public/assets")));
app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
// });
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({storage});
// route with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
// mongoose setup
const PORT = process.env.PORT || 6001;
console.log(process.env.MONGO_URL);
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

		// Add data one time
		// User.insertMany(users);
		// Post.insertMany(posts);
	})
	.catch((error) => console.log(`${error} did not connect`));
