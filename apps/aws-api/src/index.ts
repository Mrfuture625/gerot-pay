import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { usersRouter } from "./routes/users.js";
import { ordersRouter } from "./routes/orders.js";
import { cardsRouter } from "./routes/cards.js";
import { reloadsRouter } from "./routes/reloads.js";
import { withdrawalsRouter } from "./routes/withdrawals.js";
import { rewardsRouter } from "./routes/rewards.js";
import { telegramRouter } from "./routes/telegram.js";
import { notificationRouter } from "./routes/notifications.js";
import { adminRouter } from "./routes/admin.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/cards", cardsRouter);
app.use("/reloads", reloadsRouter);
app.use("/withdrawals", withdrawalsRouter);
app.use("/rewards", rewardsRouter);
app.use("/telegram", telegramRouter);
app.use("/notifications", notificationRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 KryptPay AWS API is running",
  });
});

const PORT = Number(process.env.PORT) || 5000;



app.listen(PORT, () => {
  console.log(`✅ KryptPay API running on http://localhost:${PORT}`);
});

