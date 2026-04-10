import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const featuresArray = req.body.features ? req.body.features.split(',').map(f => f.trim()).filter(Boolean) : [];
    const benefitsArray = req.body.benefits ? req.body.benefits.split(',').map(b => b.trim()).filter(Boolean) : [];

    const service = await Service.create({
      ...req.body,
      features: featuresArray,
      benefits: benefitsArray,
      imageUrl: req.file.path
    });

    res.status(201).json({ success: true, data: { service }, message: "Service created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const query = req.admin ? {} : { isActive: true };
    const services = await Service.find(query).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: { services } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const updatedData = { ...req.body };
    
    if (req.body.features) updatedData.features = req.body.features.split(',').map(f => f.trim()).filter(Boolean);
    if (req.body.benefits) updatedData.benefits = req.body.benefits.split(',').map(b => b.trim()).filter(Boolean);
    if (req.file) updatedData.imageUrl = req.file.path;

    service = await Service.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ success: true, data: { service }, message: "Service updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    service.isActive = !service.isActive;
    await service.save();
    res.status(200).json({ success: true, data: { service } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};