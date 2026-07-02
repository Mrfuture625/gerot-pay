import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { RewardType } from "../generated/prisma/client.js";

export const rewardsRouter = Router();

rewardsRouter.post("/", async (req, res) => {
  try {
    const {
      walletAddress,
      rewardType,
      amount,
      contractRewardId,
      createdAtOnchain,
    } = req.body;

    if (!walletAddress || !rewardType || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required reward fields",
      });
    }

    const normalizedWallet = String(walletAddress).toLowerCase();

    await prisma.user.upsert({
      where: { walletAddress: normalizedWallet },
      update: {},
      create: { walletAddress: normalizedWallet },
    });

    const reward = await prisma.reward.create({
      data: {
        walletAddress: normalizedWallet,
        rewardType:
          rewardType === "PURCHASE"
            ? RewardType.PURCHASE
            : rewardType === "REFERRAL"
              ? RewardType.REFERRAL
              : RewardType.SIGNUP,
        amount,
        contractRewardId: contractRewardId
          ? BigInt(contractRewardId)
          : undefined,
        createdAtOnchain: createdAtOnchain
          ? BigInt(createdAtOnchain)
          : undefined,
      },
    });

    return res.json({
      success: true,
      reward: {
        ...reward,
        contractRewardId: reward.contractRewardId?.toString() ?? null,
        createdAtOnchain: reward.createdAtOnchain?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create reward",
    });
  }
});

rewardsRouter.get("/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const rewards = await prisma.reward.findMany({
      where: { walletAddress },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      rewards: rewards.map((reward) => ({
        ...reward,
        contractRewardId: reward.contractRewardId?.toString() ?? null,
        createdAtOnchain: reward.createdAtOnchain?.toString() ?? null,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rewards",
    });
  }
});

rewardsRouter.post("/:id/mark-claimed", async (req, res) => {
  try {
    const { id } = req.params;

    const reward = await prisma.reward.update({
      where: { id },
      data: {
        claimed: true,
        claimedAt: new Date(),
      },
    });

    return res.json({
      success: true,
      reward: {
        ...reward,
        contractRewardId: reward.contractRewardId?.toString() ?? null,
        createdAtOnchain: reward.createdAtOnchain?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark reward claimed",
    });
  }
});