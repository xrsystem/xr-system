import SiteSettings from '../models/SiteSettings.js';

export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("GET Settings Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettingImage = async (req, res) => {
  try {
    const field = req.body.fieldPath; 

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }
    const url = req.file.path;

    if (!field) {
      return res.status(400).json({ success: false, message: "Field path missing" });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    if (field.includes('.')) {
        const [parent, child] = field.split('.');
        settings[parent][child] = url;
    } else {
        settings[field] = url;
    }

    await settings.save();

    res.status(200).json({ success: true, imageUrl: url, settings });
  } catch (error) {
    console.error("Update Image Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};