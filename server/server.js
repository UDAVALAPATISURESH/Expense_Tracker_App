const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", expenseRoutes);
app.use("/api", authRoutes);  // ✅ Using router
app.use("/password", passwordRoutes);

sequelize
  .sync({ alter: true  })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(5000, () => console.log("✅ Server running on port 5000"));
  })
  .catch((err) => console.error("❌ DB sync failed:", err));
