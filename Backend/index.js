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

require('dotenv').config();
// Connect to MongoDB
ConnectMongoDB()
  .then(() => console.log("MongoDB Connected Successfully."))
  .catch((err) => console.log("Error Connecting MongoDB", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin:['http://localhost:3000',process.env.ORIGIN_1,process.env.ORIGIN_2],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', '*']
}));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Authentication middleware
app.use(CheckforAuthCookie("token"));

// Routes
app.use("/api/add-new", itemRouter); 
app.use("/api", userRouter);
app.use("/api/v1/pay", paymentRoutes);
app.use("/api/review", reviewRoutes); 
app.use("/api/tracking", trackingg); 

// Reviews count endpoint
app.get('/api/reviews/count', async (req, res) => {
  try {
    const reviewsCount = await Review.countDocuments();
    res.json({ count: reviewsCount });
  } catch (error) {
    console.error('Error fetching reviews count:', error);
    res.status(500).json({ error: 'Failed to fetch reviews count' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
// console.log(process.env.PORT);
// console.log(process.env.SECRET)
const port = process.env.PORT || PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});