const express = require("express");
const {
  createKpi,
  getKpis,
  getKpiById,
  updateKpi,
  deleteKpi,
  getMyKpis
} = require("../controllers/kpiController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/my", authMiddleware, getMyKpis);
router.post("/",authMiddleware, createKpi);
router.get("/",authMiddleware, getKpis);
router.get("/:id",authMiddleware, getKpiById);
router.put("/:id",authMiddleware, updateKpi);
router.delete("/:id",authMiddleware, deleteKpi);



module.exports = router;
