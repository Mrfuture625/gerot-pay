import { Router } from "express";
import { notify } from "../services/telegramNotificationService.js";

export const notificationRouter = Router();

notificationRouter.post("/reward-claimed", async (req, res) => {
  try {
    const { walletAddress, amount, instant } = req.body;

    if (!walletAddress || !amount) {
      return res.status(400).json({
        success: false,
        message: "walletAddress and amount are required",
      });
    }

    await notify.rewardClaimed({
      walletAddress: String(walletAddress),
      amount: String(amount),
      instant: Boolean(instant),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reward notification",
    });
  }
});