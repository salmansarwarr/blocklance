import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/mongodb.js";
import router from "./routes/user.js";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiOptions from "swagger-ui-express";
import gigRoute from "./routes/gig.js";
import orderRoute from "./routes/order.js";
import messageRoute from "./routes/message.js";
import disputeRoute from "./routes/disputes.js";
import offerRoutes from './routes/offer.js'
import setupSocket from "./chat.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import { Image } from "./models/Image.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

const swaggerDefinition = {
    info: {
        title: "Blocklance",
        description: "Decentralize freelance platform",
    },
    servers: ["http://localhost:8080", ""],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./routes/*.js"],
};

const app = express();
dotenv.config();

app.use(
    "/api-docs",
    SwaggerUiOptions.serve,
    SwaggerUiOptions.setup(swaggerJSDoc(swaggerOptions))
);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});
app.use(cors());

const server = app.listen(process.env.PORT || 3001, () => {
    console.log(
        `Server listening on port ${process.env.PORT || "3000"} for socket`
    );
});

app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No image file uploaded");
    }

    const image = new Image({
        filename: req.file.filename,
        path: req.file.path,
    });

    console.log(image);
    try {
        await image.save();

        res.status(200).send("Image uploaded and saved successfully");
    } catch (error) {
        res.status(500).send("Error saving image to the database");
    }
});
app.get("/images/:filename", (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.join(__dirname, "images", filename));
});

// Define route to retrieve all images
app.get("/images", async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        console.error("Error retrieving images:", error);
        res.status(500).json({ error: "Error retrieving images" });
    }
});

app.get("/", (req, res) => res.send("App is running"));
app.use("/auth", router);
app.use("/gigs", gigRoute);
app.use("/order", orderRoute);
app.use("/message", messageRoute);
app.use("/disputes", disputeRoute);
app.use("/offer", offerRoutes)

app.use(express.static(path.join(__dirname, "app")));

connectDB().then(() => {
    app.listen(3003, () => {
        console.log(`Server listening on port ${process.env.PORT || "3000"}`);
    });
});

setupSocket(server);
