const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

router.get('/:farmerId/ledger', ledgerController.getFarmerLedger);
router.post('/receipts/collect', ledgerController.collectPayment);

module.exports = router;