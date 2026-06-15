import BackInStockSubscription from "../models/backInStockSubscription.js";
import { emitCustomerNotification } from "../modules/notifications/notification.service.js";
import { NOTIFICATION_EVENTS } from "../modules/notifications/notification.constants.js";
import logger from "./logger.js";

/**
 * Notifies all customers subscribed to the given product that it is back in stock.
 * Marks their subscriptions as notified.
 * @param {Object} product - The product document that was restocked.
 */
export const notifyBackInStock = async (product) => {
  try {
    const productId = product._id;
    
    // Find all pending subscriptions
    const subscriptions = await BackInStockSubscription.find({
      productId,
      status: "pending",
    });

    if (subscriptions.length === 0) {
      return;
    }

    logger.info(
      `Sending back-in-stock notifications for product ${product.name} (ID: ${productId}) to ${subscriptions.length} users`
    );

    // Notify each user
    for (const sub of subscriptions) {
      emitCustomerNotification(NOTIFICATION_EVENTS.PRODUCT_BACK_IN_STOCK, {
        userId: sub.userId,
        productId,
        productName: product.name,
        data: {
          productId,
          productName: product.name,
        },
      });
    }

    // Mark subscriptions as notified
    await BackInStockSubscription.updateMany(
      { productId, status: "pending" },
      { $set: { status: "notified" } }
    );
  } catch (error) {
    logger.error("Error sending back-in-stock notifications", {
      scope: "notifyBackInStock",
      error,
    });
  }
};
