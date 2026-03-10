import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./innjest/index.js";
import showRouter from "./routes/showRouter.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRouter.js";
import userRouter from "./routes/userRoutes.js";
import theatreRouter from "./routes/theatreRouter.js";
import { stripeWebhooks } from "./controllers/stripeWebhook.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const port = 3000;

await connectDB();

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Stripe webhooks route
app.use("/api/stripe", express.raw({type: "application/json"}), stripeWebhooks)

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// API Routes
app.get("/", (req, res) => {
  res.send("Server is Live!!!");
});

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

// Routers
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/theatres", theatreRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
