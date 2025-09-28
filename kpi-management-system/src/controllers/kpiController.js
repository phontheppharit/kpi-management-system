const { Kpi, User } = require("../models/model");

/* ---------------- Helper Function ---------------- */
const resolveAssignedUser = async (assigned_user) => {
  if (!assigned_user) return null;

  // ถ้าเป็น ObjectId ที่ถูกต้อง → ใช้ได้เลย
  if (assigned_user.match(/^[0-9a-fA-F]{24}$/)) {
    return assigned_user;
  }

  // ถ้าเป็น username → หา user แล้วคืนค่า _id
  const user = await User.findOne({ username: assigned_user });
  return user ? user._id : null;
};

/* ---------------- CREATE KPI ---------------- */
exports.createKpi = async (req, res) => {
  try {
    const data = { ...req.body };

    // แปลง assigned_user ถ้ามี
    if (data.assigned_user) {
      data.assigned_user = await resolveAssignedUser(data.assigned_user);
    }

    const kpi = new Kpi(data);
    await kpi.save();

    res.status(201).json(kpi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ---------------- GET ALL KPIs ---------------- */
exports.getKpis = async (req, res) => {
  try {
    const kpis = await Kpi.find().populate("assigned_user", "username email");
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- GET KPI BY ID ---------------- */
exports.getKpiById = async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id).populate("assigned_user", "username email");
    if (!kpi) return res.status(404).json({ error: "KPI not found" });
    res.json(kpi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- UPDATE KPI ---------------- */
exports.updateKpi = async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id);

    if (!kpi) return res.status(404).json({ message: "KPI not found" });

    // ถ้าไม่ใช่ admin และ KPI นี้ไม่ได้ assigned ให้ user คนนี้ → ห้ามแก้ไข
    if (req.user.role !== "Admin" && kpi.assigned_user.toString() !== req.user.id) {
      return res.status(403).json({ message: "ไม่อนุญาตให้แก้ KPI นี้" });
    }

    Object.assign(kpi, req.body);
    await kpi.save();
    res.json(kpi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteKpi = async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id);

    if (!kpi) return res.status(404).json({ message: "KPI not found" });

    if (req.user.role !== A && kpi.assigned_user.toString() !== req.user.id) {
      return res.status(403).json({ message: "ไม่อนุญาตให้ลบ KPI นี้" });
    }

    await kpi.deleteOne();
    res.json({ message: "KPI deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMyKpis = async (req, res) => {
  try {
    console.log("📌 getMyKpis called. req.user =", req.user);

    const kpis = await Kpi.find({ assigned_user: req.user.id })
      .populate("assigned_user", "username email");

    res.json(kpis);
  } catch (err) {
    console.error("🔥 getMyKpis Error:", err.message, err.stack);
    res.status(500).json({ message: err.message });
  }
};


