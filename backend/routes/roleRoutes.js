import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controllers/roleController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(protect, isAdmin, getRoles)
  .post(protect, isAdmin, createRole);

router.route("/:id")
  .put(protect, isAdmin, updateRole)
  .delete(protect, isAdmin, deleteRole);

export default router;
