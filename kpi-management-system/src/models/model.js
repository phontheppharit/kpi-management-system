const mongoose = require("mongoose");

/* ---------------- ROLE SCHEMA ---------------- */
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Admin", "User"], 
    unique: true,
    required: true,
  },
});

/* ---------------- USER SCHEMA ---------------- */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    role: {
     type: String,
     enum: ["Admin", "User"],
     default: "User",
    },
  },
  { timestamps: true } 
);

/* ---------------- KPI SCHEMA ---------------- */
const kpiSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    target_value: { type: Number, required: true },
    actual_value: { type: Number, default: 0.0 },
    status: {
      type: String,
      enum: ["On Track", "At Risk", "Off Track"],
    },
    assigned_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  { timestamps: true }
);

/* ---------------- KPI UPDATES SCHEMA ---------------- */
const kpiUpdateSchema = new mongoose.Schema(
  {
    kpi_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kpi", 
      required: true,
    },
    updated_value: { type: Number, required: true },
    comment: String,
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

/* ---------------- EXPORT MODELS ---------------- */
const Role = mongoose.model("Role", roleSchema);
const User = mongoose.model("User", userSchema);
const Kpi = mongoose.model("Kpi", kpiSchema);
const KpiUpdate = mongoose.model("KpiUpdate", kpiUpdateSchema);

module.exports = {
  Role,
  User,
  Kpi,
  KpiUpdate,
};
