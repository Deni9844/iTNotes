const express = require('express');
const { isAuthenticateUser } = require('../middleware/auth');
const { initializeEsewa, completePayment, cancelPurchase, getAllPurchases, deletePurchase, getAllActivePurchases, expirePurchase } = require('../controllers/paymentController');

const router = express.Router();

router.route('/initialize-esewa').post(isAuthenticateUser,initializeEsewa)

router.route('/complete-payment').post(isAuthenticateUser,completePayment)

router.route('/cancel-payment').post(isAuthenticateUser,cancelPurchase)

router.route('/expire-payment').post(isAuthenticateUser,expirePurchase)

router.route('/purchases').get(isAuthenticateUser,getAllPurchases)

router.route('/purchases/active').get(isAuthenticateUser,getAllActivePurchases)

router.route('/purchase/:id').delete(isAuthenticateUser,deletePurchase)

module.exports = router