const express = require('express');
const router = express.Router();
const db = require('../database/db');
const config = require('../../config/default.json');
const { success } = require('../utils/response');

// GET /api/payment/info
router.get('/info', (req, res) => {
  const settings = db.getAdminSettings();
  return success(res, {
    price: settings.subscriptionPrice || config.subscription.price,
    currency: 'IDR',
    durationMonths: config.subscription.durationMonths,
    qrCode: settings.paymentQr || '/images/payment-qr.png',
    whatsappNumber: config.subscription.whatsappNumber,
    whatsappText: encodeURIComponent(
      `Halo Admin Kreaverse AI,\n\n` +
      `Saya ingin mengkonfirmasi pembayaran langganan:\n` +
      `📦 Paket: Unlimited 3 Bulan\n` +
      `💰 Harga: Rp ${Number(settings.subscriptionPrice || config.subscription.price).toLocaleString('id-ID')}\n\n` +
      `Mohon konfirmasi aktivasi akun saya.\nTerima kasih! 🙏`
    )
  });
});

module.exports = router;