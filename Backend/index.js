const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const Review = require('./models/reviewModel');
const app = express();
const { PORT, HOST } = require("./config");
const { ConnectMongoDB } = require("./connection");
const { CheckforAuthCookie } = require("./middlewares/auth");
const userRouter = require("./routes/user");
const paymentRoutes = require("./routes/paymentRoutes");
const itemRouter = require("./routes/items");
const reviewRoutes = require("./routes/reviewRoutes"); 
const trackingg = require("./routes/tracking"); 

// Connect to MongoDB
ConnectMongoDB()
  .then(() => console.log("MongoDB Connected Successfully."))
  .catch((err) => console.log("Error Connecting MongoDB", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(CheckforAuthCookie("token"));
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Foodie API' });
});

// Routes
app.use("/api/add-new/", itemRouter);
app.use("/api", userRouter);
app.use("/api/v1/pay", paymentRoutes);
app.use("/api/review", reviewRoutes); 
app.use("/api/tracking", trackingg); 

app.get('/api/reviews/count', async (req, res) => {
  try {
    const reviewsCount = await Review.countDocuments();
    res.json({ count: reviewsCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews count' });
  }
});

// Test route
app.get("/test", (req, res) => {
  return res.json({ status: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, HOST, () => console.log(`Server Running on PORT:${PORT}`));