const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { success, error } = require('../utils/response');

// GET /api/referral/my-code
router.get('/my-code', (req, res) => {
  const user = req.user;
  if (!user.referral_code) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    db.updateUser(user.id, { referral_code: code });
    return success(res, { code });
  }
  return success(res, { code: user.referral_code });
});

// POST /api/referral/use
router.post('/use', (req, res) => {
  const { code } = req.body;
  if (!code) return error(res, 'Kode referral wajib diisi', 400);
  
  const referrer = db.getUserByReferralCode(code.toUpperCase());
  if (!referrer) return error(res, 'Kode referral tidak valid', 404);
  if (referrer.id === req.user.id) return error(res, 'Tidak bisa menggunakan kode referral sendiri', 400);
  
  const alreadyUsed = db.getDb().prepare(
    'SELECT id FROM referrals WHERE referred_id = ?'
  ).get(req.user.id);
  if (alreadyUsed) return error(res, 'Kamu sudah pernah menggunakan kode referral', 400);
  
  // Give 3 days trial to referrer
  const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  db.updateUser(referrer.id, { trial_ends_at: trialEnd });
  
  db.createReferral({
    id: uuidv4(),
    referrerId: referrer.id,
    referredId: req.user.id,
    code: code.toUpperCase()
  });
  
  return success(res, { message: 'Referral berhasil! Teman kamu mendapat 3 hari trial.' });
});

// GET /api/referral/stats
router.get('/stats', (req, res) => {
  const referrals = db.getDb().prepare(`
    SELECT r.*, u.email as referred_email, u.name as referred_name
    FROM referrals r JOIN users u ON r.referred_id = u.id
    WHERE r.referrer_id = ? ORDER BY r.rewarded_at DESC
  `).all(req.user.id);
  return success(res, { referrals, totalReferrals: referrals.length });
});

module.exports = router;