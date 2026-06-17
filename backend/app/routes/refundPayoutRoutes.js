import express from "express";
import {
  submitRefundDetails,
  updateRefundDetails,
  getMyRefundStatus,
  adminListRefunds,
  adminGetRefundDetail,
  adminDecryptRefund,
  adminUpdateRefundStatus,
} from "../controller/refundPayoutController.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer Routes (Allows customer, user, or admin acting as customer)
router.post(
  "/refund-payouts/:orderId",
  verifyToken,
  allowRoles("customer", "user", "admin"),
  submitRefundDetails
);

router.patch(
  "/refund-payouts/:orderId",
  verifyToken,
  allowRoles("customer", "user", "admin"),
  updateRefundDetails
);

router.get(
  "/refund-payouts/:orderId/status",
  verifyToken,
  allowRoles("customer", "user", "admin"),
  getMyRefundStatus
);

// Admin Routes (Strictly allow admin only)
router.get(
  "/admin/refund-payouts",
  verifyToken,
  allowRoles("admin"),
  adminListRefunds
);

router.get(
  "/admin/refund-payouts/:id",
  verifyToken,
  allowRoles("admin"),
  adminGetRefundDetail
);

router.post(
  "/admin/refund-payouts/:id/decrypt",
  verifyToken,
  allowRoles("admin"),
  adminDecryptRefund
);

router.patch(
  "/admin/refund-payouts/:id/status",
  verifyToken,
  allowRoles("admin"),
  adminUpdateRefundStatus
);

export default router;
