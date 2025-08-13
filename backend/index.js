const express = require('express');
const app = express();
const connectDB = require('./config/dbConnection')
require('dotenv').config();
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register')
const verifyJWT = require('./middleware/verifyJWT')
const adminRoutes = require('./routes/admin')
const PORT = process.env.PORT || 3500;

connectDB();
app.use(cors());
app.use(express.json());

// routes
app.use("/rgistration", registerRoutes);
app.use("/authentication", authRoutes)
app.use("/todo", verifyJWT, todoRoutes);
app.use('/admin', verifyJWT, adminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));