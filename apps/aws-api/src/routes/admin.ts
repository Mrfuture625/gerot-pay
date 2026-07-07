import { Router } from "express";
import multer from "multer";
import { prisma } from "../config/prisma.js";
import { importCardCsv } from "../services/cardCsvImportService.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import {
  getCardPricesOnchain,
  setCardPriceOnchain,
   getEthUsdPriceOnchain,
  setEthUsdPriceOnchain,
} from "../services/marketplacePriceContractService.js";
import {
  getRewardSettingsOnchain,
  setRewardAmountsOnchain,
} from "../services/rewardSettingsContractService.js";

export const adminRouter = Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

adminRouter.post(
  "/cards/import",
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "CSV file is required",
        });
      }

      const result = await importCardCsv(req.file.path, req.file.originalname);

      return res.json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to import card CSV",
      });
    }
  },
);

adminRouter.get("/inventory", requireAdmin, async (req, res) => {
  try {
    const [virtualAvailable, virtualSold, physicalAvailable, physicalSold] =
      await Promise.all([
        prisma.cardInventory.count({
          where: { cardType: "VIRTUAL", assigned: false },
        }),
        prisma.cardInventory.count({
          where: { cardType: "VIRTUAL", assigned: true },
        }),
        prisma.cardInventory.count({
          where: { cardType: "PHYSICAL", assigned: false },
        }),
        prisma.cardInventory.count({
          where: { cardType: "PHYSICAL", assigned: true },
        }),
      ]);

    return res.json({
      success: true,
      virtual: {
        available: virtualAvailable,
        sold: virtualSold,
      },
      physical: {
        available: physicalAvailable,
        sold: physicalSold,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load inventory.",
    });
  }
});

adminRouter.get("/inventory/batches", requireAdmin, async (req, res) => {
  try {
    const batches = await prisma.cardInventory.groupBy({
      by: ["batch"],
      _count: {
        id: true,
      },
      orderBy: {
        batch: "desc",
      },
    });

    return res.json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load batches.",
    });
  }
});

adminRouter.get("/card-prices", requireAdmin, async (req, res) => {
  try {
    const prices = await getCardPricesOnchain();

    return res.json({
      success: true,
      prices,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load card prices.",
    });
  }
});

adminRouter.patch("/card-prices/:cardType", requireAdmin, async (req, res) => {
  try {
    const cardType = String(req.params.cardType);
    const priceUsd = Number(req.body.priceUsd);

    const result = await setCardPriceOnchain(cardType, priceUsd);

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update card price.",
    });
  }
});

adminRouter.get("/eth-usd-price", requireAdmin, async (req, res) => {
  try {
    const price = await getEthUsdPriceOnchain();

    return res.json({
      success: true,
      price,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load ETH/USD price.",
    });
  }
});

adminRouter.patch("/eth-usd-price", requireAdmin, async (req, res) => {
  try {
    const priceUsd = Number(req.body.priceUsd);
    const result = await setEthUsdPriceOnchain(priceUsd);

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update ETH/USD price.",
    });
  }
});

adminRouter.get("/reward-settings", requireAdmin, async (req, res) => {
  try {
    const settings = await getRewardSettingsOnchain();

    return res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load reward settings.",
    });
  }
});

adminRouter.patch("/reward-settings", requireAdmin, async (req, res) => {
  try {
    const result = await setRewardAmountsOnchain({
      signupReward: Number(req.body.signupReward),
      referralReward: Number(req.body.referralReward),
      virtualCardReward: Number(req.body.virtualCardReward),
      physicalCardReward: Number(req.body.physicalCardReward),
    });

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update reward settings.",
    });
  }
});