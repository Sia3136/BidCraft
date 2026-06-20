const db = require('../utils/db');
const emailService = require('./emailService');
const notificationService = require('./notificationService');

/**
 * Automatically releases escrow for orders delivered > 24 hours ago,
 * provided there are no active disputes.
 */
async function autoReleaseEscrow() {
  const client = await db.pool.connect();
  let releasedCount = 0;
  try {
    // We want to lock the rows so concurrent jobs don't process them
    await client.query('BEGIN');

    // Find escrows eligible for release:
    // 1. escrow.status = 'held'
    // 2. shipments.status = 'delivered' and shipments.delivered_at < NOW() - 24 hours
    // 3. NO active disputes for this escrow (disputes.status IN ('open', 'under_review'))
    const eligibleRes = await client.query(`
      SELECT e.id as escrow_id, e.order_id, e.amount_held, e.seller_id,
             u.email as seller_email, u.name as seller_name
      FROM escrow e
      JOIN shipments s ON s.order_id = e.order_id
      JOIN users u ON u.id = e.seller_id
      WHERE e.status = 'held'
        AND s.status = 'delivered'
        AND s.delivered_at <= NOW() - INTERVAL '1 day'
        AND NOT EXISTS (
          SELECT 1 FROM disputes d 
          WHERE d.escrow_id = e.id 
            AND d.status IN ('open', 'under_review')
        )
      FOR UPDATE OF e SKIP LOCKED
    `);

    for (const row of eligibleRes.rows) {
      // 1. Update escrow status
      await client.query(`
        UPDATE escrow 
        SET status = 'released', released_at = NOW(), updated_at = NOW() 
        WHERE id = $1
      `, [row.escrow_id]);

      // 2. Add audit log
      await client.query(`
        INSERT INTO escrow_audit_log (escrow_id, old_status, new_status, reason, created_at)
        VALUES ($1, 'held', 'released', 'System auto-release after 24 hours', NOW())
      `, [row.escrow_id]);

      // 3. Update order status if not already completed/closed
      await client.query(`
        UPDATE orders 
        SET status = 'completed', updated_at = NOW() 
        WHERE id = $1 AND status != 'completed'
      `, [row.order_id]);

      // 4. Notify seller
      try {
        await notificationService.createNotification(client, {
          userId: row.seller_id,
          type: 'escrow_released',
          title: 'Funds Released!',
          message: `Your escrowed funds of $${row.amount_held} have been automatically released to your payout method.`,
          data: { order_id: row.order_id, amount: row.amount_held }
        });

        if (row.seller_email) {
          await emailService.sendEmail({
            to: row.seller_email,
            subject: 'Your BidCraft Funds Have Been Released',
            text: `Hello ${row.seller_name || 'Creator'},\n\nThe 24-hour delivery inspection window has passed with no disputes, so your escrowed funds of $${row.amount_held} have been successfully released for payout.\n\nBest,\nThe BidCraft Team`
          });
        }
      } catch (err) {
        console.error(`Failed to notify seller ${row.seller_id} of escrow release:`, err);
      }

      releasedCount++;
    }

    await client.query('COMMIT');
    if (releasedCount > 0) {
      console.log(`Successfully auto-released ${releasedCount} escrow(s).`);
    }
    return { success: true, releasedCount };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error auto-releasing escrow:', err);
    throw err;
  } finally {
    client.release();
  }
}

}

/**
 * Manually release escrow by the buyer.
 */
async function releaseEscrowManually(orderId, buyerId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const escrowRes = await client.query(
      `SELECT e.*, o.buyer_id, u.email as seller_email, u.name as seller_name 
       FROM escrow e
       JOIN orders o ON o.id = e.order_id
       JOIN users u ON u.id = e.seller_id
       WHERE e.order_id = $1 FOR UPDATE OF e`,
      [orderId]
    );

    const escrow = escrowRes.rows[0];
    if (!escrow) throw new Error('escrow_not_found');
    if (escrow.buyer_id !== buyerId) throw new Error('unauthorized_action');
    if (escrow.status === 'released') throw new Error('already_released');
    if (escrow.status === 'disputed' || escrow.status === 'refunded') throw new Error('cannot_release_in_current_state');

    // Release
    await client.query(`UPDATE escrow SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE id = $1`, [escrow.id]);
    await client.query(`UPDATE orders SET status = 'completed', updated_at = NOW() WHERE id = $1`, [orderId]);
    await client.query(`INSERT INTO escrow_audit_log (escrow_id, old_status, new_status, actor_id, reason, created_at)
                        VALUES ($1, $2, 'released', $3, 'Manual release by buyer', NOW())`, 
                       [escrow.id, escrow.status, buyerId]);

    try {
      await notificationService.createNotification(client, {
        userId: escrow.seller_id,
        type: 'escrow_released',
        title: 'Funds Released!',
        message: `The buyer has manually released your funds of $${escrow.amount_held}.`,
        data: { order_id: orderId, amount: escrow.amount_held }
      });
      if (escrow.seller_email) {
        await emailService.sendEmail({
          to: escrow.seller_email,
          subject: 'Your BidCraft Funds Have Been Released',
          text: `Hello ${escrow.seller_name || 'Creator'},\n\nThe buyer has explicitly released the funds for order #${orderId}. Your escrowed funds of $${escrow.amount_held} have been successfully released for payout.\n\nBest,\nThe BidCraft Team`
        });
      }
    } catch (err) {
      console.error('Failed to notify seller of manual escrow release:', err);
    }

    await client.query('COMMIT');
    return { success: true, escrow_id: escrow.id };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { autoReleaseEscrow, releaseEscrowManually };
