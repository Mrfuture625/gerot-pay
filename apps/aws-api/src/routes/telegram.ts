import { Router } from "express";
import { RewardType } from "../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";
import { addSignupRewardOnchain } from "../services/rewardContractService.js";

export const telegramRouter = Router();

telegramRouter.post("/link", async (req, res) => {
  try {
    const { walletAddress, telegramId, telegramUsername } = req.body;

    if (!walletAddress || !telegramId) {
      return res.status(400).json({
        success: false,
        message: "walletAddress and telegramId are required",
      });
    }

    const normalizedWallet = String(walletAddress).toLowerCase();

    const user = await prisma.user.upsert({
      where: { walletAddress: normalizedWallet },
      update: {
        telegramId: String(telegramId),
        telegramUsername: telegramUsername || null,
      },
      create: {
        walletAddress: normalizedWallet,
        telegramId: String(telegramId),
        telegramUsername: telegramUsername || null,
      },
    });

    return res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to link Telegram account",
    });
  }
});

telegramRouter.get("/wallet/:telegramId", async (req, res) => {
  try {
    const telegramId = String(req.params.telegramId);

    const user = await prisma.user.findFirst({
      where: { telegramId },
    });

    return res.json({
      success: true,
      walletAddress: user?.walletAddress ?? null,
      telegramCompleted: user?.telegramCompleted ?? false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load linked wallet",
    });
  }
});

telegramRouter.post("/verify", async (req, res) => {
  try {
    const { walletAddress, telegramId, telegramUsername } = req.body;

    if (!walletAddress || !telegramId) {
      return res.status(400).json({
        success: false,
        message: "walletAddress and telegramId are required",
      });
    }

    const normalizedWallet = String(walletAddress).toLowerCase();

    const user = await prisma.user.upsert({
      where: { walletAddress: normalizedWallet },
      update: {
        telegramId: String(telegramId),
        telegramUsername: telegramUsername || null,
        telegramCompleted: true,
        signupRewardEligible: true,
      },
      create: {
        walletAddress: normalizedWallet,
        telegramId: String(telegramId),
        telegramUsername: telegramUsername || null,
        telegramCompleted: true,
        signupRewardEligible: true,
      },
    });

    let signupReward = null;

    const existingSignupReward = await prisma.reward.findFirst({
      where: {
        walletAddress: normalizedWallet,
        rewardType: RewardType.SIGNUP,
      },
    });

    if (!existingSignupReward) {
      const onchainReward = await addSignupRewardOnchain(
        normalizedWallet as `0x${string}`,
      );

      signupReward = await prisma.reward.create({
        data: {
          walletAddress: normalizedWallet,
          rewardType: RewardType.SIGNUP,
          amount: onchainReward.amountKpay,
          contractRewardId: onchainReward.rewardId
            ? BigInt(onchainReward.rewardId)
            : undefined,
          createdAtOnchain: onchainReward.createdAt
            ? BigInt(onchainReward.createdAt)
            : undefined,
        },
      });
    }

    return res.json({
  success: true,
  user,
  signupReward: signupReward
    ? {
        ...signupReward,
        contractRewardId: signupReward.contractRewardId?.toString() ?? null,
        createdAtOnchain: signupReward.createdAtOnchain?.toString() ?? null,
      }
    : null,
});
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify Telegram task",
    });
  }
});

telegramRouter.get("/status/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    return res.json({
      success: true,
      telegramCompleted: user?.telegramCompleted ?? false,
      signupRewardEligible: user?.signupRewardEligible ?? false,
      telegramUsername: user?.telegramUsername ?? null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Telegram status",
    });
  }
});