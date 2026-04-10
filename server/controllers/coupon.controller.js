import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Please enter a promo code.' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired promo code.' });

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    res.status(200).json({
      success: true,
      data: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
      message: 'Promo code applied successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: { coupon: newCoupon }, message: "Coupon created" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Code already exists or invalid data" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { coupons } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ success: true, data: { coupon } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};