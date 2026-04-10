import Pricing from '../models/Pricing.js';

export const createPlan = async (req, res) => {
  try {
    const featuresArray = req.body.features ? req.body.features.split(',').map(f => f.trim()).filter(Boolean) : [];
    
    const plan = await Pricing.create({ ...req.body, features: featuresArray });
    res.status(201).json({ success: true, data: { plan }, message: "Plan created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const query = req.admin ? {} : { isActive: true };
    const plans = await Pricing.find(query).sort({ price: 1 });
    res.status(200).json({ success: true, data: { plans } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    
    if (req.body.features !== undefined) {
      updatedData.features = typeof req.body.features === 'string' 
        ? req.body.features.split(',').map(f => f.trim()).filter(Boolean)
        : req.body.features;
    }
    
    const plan = await Pricing.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
    
    res.status(200).json({ success: true, data: { plan }, message: "Plan updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePlanStatus = async (req, res) => {
  try {
    const plan = await Pricing.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
    
    plan.isActive = !plan.isActive;
    await plan.save();
    res.status(200).json({ success: true, data: { plan } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await Pricing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Plan deleted completely" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};