import React, { useState, useEffect } from 'react';
import { Upload, User, LayoutTemplate, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function MediaManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  const [siteContent, setSiteContent] = useState({
    homeBanner: '',
    founder1Photo: '',
    founder2Photo: '',
    founder3Photo: '',
    founder4Photo: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/site-settings');
        if (res.data?.settings) {
          setSiteContent({
            homeBanner: res.data.settings.homeBanner || '',
            founder1Photo: res.data.settings.team?.jsMahato || '',
            founder2Photo: res.data.settings.team?.monuNayak || '',
            founder3Photo: res.data.settings.team?.chandiSahu || '',
            founder4Photo: res.data.settings.team?.priyanshuGupta || ''
          });
        }
      } catch (error) {
        console.error("Failed to load images", error);
      }
    };
    fetchSettings();
  }, []);

  const handlePhotoChange = async (e, fieldName, dbFieldPath) => {
    const file = e.target.files[0];
    if (!file) return;

    setActiveSection(fieldName);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('fieldPath', dbFieldPath); 

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await axios.put('/api/site-settings/update-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setSiteContent(prev => ({ ...prev, [fieldName]: res.data.imageUrl }));
      alert('✅ Website photo updated successfully!');
      
    } catch (error) {
      console.error(error);
      alert('❌ Failed to update photo');
    } finally {
      setIsUploading(false);
      setActiveSection(null);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <LayoutTemplate className="text-brand-600" />
          <h3 className="text-lg font-bold text-slate-900">Home Page Settings</h3>
        </div>

        <div className="space-y-3 max-w-2xl">
          <label className="text-sm font-semibold text-slate-700">Main Hero Banner (1920x1080px)</label>
          <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 group">
            {siteContent.homeBanner ? (
               <img src={siteContent.homeBanner} alt="Hero Banner" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400">No Banner Set</div>
            )}
            
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <input 
                type="file" 
                id="homeBanner" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handlePhotoChange(e, 'homeBanner', 'homeBanner')}
              />
              <label htmlFor="homeBanner" className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                {isUploading && activeSection === 'homeBanner' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16} />}
                Change Banner
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <User className="text-brand-600" />
          <h3 className="text-lg font-bold text-slate-900">About Page - Leadership Team</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FounderBox 
            name="JS Mahato" 
            role="Founder & CEO"
            image={siteContent.founder1Photo}
            isUploading={isUploading && activeSection === 'founder1Photo'}
            onUpload={(e) => handlePhotoChange(e, 'founder1Photo', 'team.jsMahato')}
          />
          
          <FounderBox 
            name="Monu Nayak" 
            role="Co-Founder"
            image={siteContent.founder2Photo}
            isUploading={isUploading && activeSection === 'founder2Photo'}
            onUpload={(e) => handlePhotoChange(e, 'founder2Photo', 'team.monuNayak')}
          />

          <FounderBox 
            name="Chandi Sahu" 
            role="CTO"
            image={siteContent.founder3Photo}
            isUploading={isUploading && activeSection === 'founder3Photo'}
            onUpload={(e) => handlePhotoChange(e, 'founder3Photo', 'team.chandiSahu')}
          />

          <FounderBox 
            name="Priyanshu Gupta" 
            role="CFO"
            image={siteContent.founder4Photo}
            isUploading={isUploading && activeSection === 'founder4Photo'}
            onUpload={(e) => handlePhotoChange(e, 'founder4Photo', 'team.priyanshuGupta')}
          />
        </div>
      </div>

    </div>
  );
}

function FounderBox({ name, role, image, isUploading, onUpload }) {
  const id = name.replace(/\s+/g, '');
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-sm font-semibold text-slate-700">{name}</label>
        <span className="text-[10px] text-brand-600 font-bold uppercase">{role}</span>
      </div>
      <div className="relative aspect-3/4 bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 group">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Photo</div>
        )}
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <input type="file" id={id} className="hidden" accept="image/*" onChange={onUpload} />
          <label htmlFor={id} className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
            {isUploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16} />}
            Update
          </label>
        </div>
      </div>
    </div>
  );
}