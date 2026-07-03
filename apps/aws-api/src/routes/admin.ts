import { Router } from "express";
import multer from "multer";
import { prisma } from "../config/prisma.js";
import { importCardCsv } from "../services/cardCsvImportService.js";
import { requireAdmin } from "../middleware/adminAuth.js";

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