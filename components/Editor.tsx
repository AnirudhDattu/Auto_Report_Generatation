
import React, { useRef } from 'react';
import { ReportData, RecommendationRow, FontConfig } from '../types';
import { ChevronDown, ChevronUp, Plus, Trash2, X, Type, Upload } from 'lucide-react';

interface EditorProps {
  data: ReportData;
  onChange: (newData: ReportData) => void;
}

const FONT_OPTIONS = [
  "Arial",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Playfair Display"
];

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ReportData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleDeepChange = (parent: keyof ReportData, child: string, value: string) => {
    onChange({
      ...data,
      [parent]: {
        ...(data[parent] as any),
        [child]: value
      }
    });
  };

  const handleFontChange = (key: keyof FontConfig, font: string) => {
    if (key === 'global') {
       onChange({
         ...data,
         fonts: {
           global: font,
           title: font,
           headers: font,
           body: font
         }
       });
    } else {
       onChange({
         ...data,
         fonts: {
           ...data.fonts,
           [key]: font
         }
       });
    }
  };

  const handleImageUpload = (field: 'logoImage' | 'signatureImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateRecommendation = (index: number, field: keyof RecommendationRow, value: string) => {
    const newRecs = [...data.recommendations];
    newRecs[index] = { ...newRecs[index], [field]: value };
    handleChange('recommendations', newRecs);
  };

  const addRecommendation = () => {
    const newRec = {
      id: Math.random().toString(),
      priorityLabel: "3rd priority point",
      priorityColor: "bg-gray-300",
      pointNo: "03",
      depth: "0",
      yieldVal: "",
      layers: "",
      casing: "",
      rowColor: "bg-gray-200"
    };
    handleChange('recommendations', [...data.recommendations, newRec]);
  };

  const removeRecommendation = (index: number) => {
    const newRecs = [...data.recommendations];
    newRecs.splice(index, 1);
    handleChange('recommendations', newRecs);
  };

  const addRemark = () => {
    handleChange('remarks', [...data.remarks, "New remark point"]);
  };

  const updateRemark = (index: number, val: string) => {
    const newRemarks = [...data.remarks];
    newRemarks[index] = val;
    handleChange('remarks', newRemarks);
  };

  const removeRemark = (index: number) => {
    const newRemarks = [...data.remarks];
    newRemarks.splice(index, 1);
    handleChange('remarks', newRemarks);
  };

  return (
    <div className="flex flex-col gap-6 p-6 text-sm text-gray-300">
      
      {/* File Settings */}
      <Section title="Report Settings">
        <Input label="Output Filename" value={data.fileName} onChange={(v) => handleChange('fileName', v)} />
        <Input label="Surveyor Name (Footer)" value={data.surveyorName} onChange={(v) => handleChange('surveyorName', v)} />
        
        <div className="mt-4 space-y-4">
          <ImageUploader 
            label="Logo Image" 
            preview={data.logoImage} 
            onChange={(e) => handleImageUpload('logoImage', e)}
            onClear={() => handleChange('logoImage', '')}
          />
          <ImageUploader 
            label="Signature Image" 
            preview={data.signatureImage} 
            onChange={(e) => handleImageUpload('signatureImage', e)}
             onClear={() => handleChange('signatureImage', '')}
          />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
         <div className="space-y-3">
            <FontSelector 
               label="Global Font (Applies to all)" 
               value={data.fonts.global} 
               onChange={(v) => handleFontChange('global', v)} 
            />
            <div className="border-t border-gray-800 my-2"></div>
            <p className="text-xs text-gray-500 font-bold uppercase">Section Overrides</p>
            <FontSelector 
               label="Main Title" 
               value={data.fonts.title} 
               onChange={(v) => handleFontChange('title', v)} 
            />
            <FontSelector 
               label="Section Headers" 
               value={data.fonts.headers} 
               onChange={(v) => handleFontChange('headers', v)} 
            />
            <FontSelector 
               label="Body Text" 
               value={data.fonts.body} 
               onChange={(v) => handleFontChange('body', v)} 
            />
         </div>
      </Section>

      {/* General Information */}
      <Section title="General Information">
        <Input label="Serial No." value={data.sNo} onChange={(v) => handleChange('sNo', v)} />
        <Input label="Date" value={data.date} onChange={(v) => handleChange('date', v)} />
        <TextArea label="To Address" value={data.toAddress} onChange={(v) => handleChange('toAddress', v)} />
      </Section>

      {/* Geology Details */}
      <Section title="Site Details">
        <TextArea label="Location" value={data.location} onChange={(v) => handleChange('location', v)} rows={3} />
        <TextArea label="Physiography" value={data.physiography} onChange={(v) => handleChange('physiography', v)} rows={3} />
        <TextArea label="Topography" value={data.topographical} onChange={(v) => handleChange('topographical', v)} rows={3} />
        <TextArea label="Geological Condition" value={data.geological} onChange={(v) => handleChange('geological', v)} rows={3} />
      </Section>

      {/* Bed Thickness */}
      <Section title="Bed Thickness">
        <Input label="Over burden" value={data.thicknessBeds.a} onChange={(v) => handleDeepChange('thicknessBeds', 'a', v)} />
        <Input label="Weathered zone" value={data.thicknessBeds.b} onChange={(v) => handleDeepChange('thicknessBeds', 'b', v)} />
        <Input label="Depth of basement" value={data.thicknessBeds.c} onChange={(v) => handleDeepChange('thicknessBeds', 'c', v)} />
      </Section>

      {/* Hydro & Geophysical */}
      <Section title="Hydro & Geophysical">
        <TextArea label="Hydrological Condition" value={data.hydrological} onChange={(v) => handleChange('hydrological', v)} rows={2} />
        <TextArea label="Intrusive Rocks" value={data.intrusiveRocks} onChange={(v) => handleChange('intrusiveRocks', v)} rows={2} />
        <TextArea label="Groundwater Cond." value={data.groundwater} onChange={(v) => handleChange('groundwater', v)} rows={2} />
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Input label="Survey Type" value={data.geophysical.type} onChange={(v) => handleDeepChange('geophysical', 'type', v)} />
          <Input label="Survey Results" value={data.geophysical.results} onChange={(v) => handleDeepChange('geophysical', 'results', v)} />
        </div>
      </Section>

      {/* Recommendations */}
      <Section title="Recommendations (Table)">
        {data.recommendations.map((rec, idx) => (
          <div key={rec.id || idx} className="bg-gray-800 p-4 rounded-md border border-gray-700 mb-4 relative group">
            <button 
              onClick={() => removeRecommendation(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
            <h4 className="font-bold text-xs text-gray-500 uppercase mb-3">Row {idx + 1}</h4>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input label="Priority Label" value={rec.priorityLabel} onChange={(v) => updateRecommendation(idx, 'priorityLabel', v)} />
              <Input label="Point No" value={rec.pointNo} onChange={(v) => updateRecommendation(idx, 'pointNo', v)} />
            </div>

            <div className="grid grid-cols-1 gap-3 mb-3">
               <Input label="Depth" value={rec.depth} onChange={(v) => updateRecommendation(idx, 'depth', v)} />
               <Input label="Yield" value={rec.yieldVal} onChange={(v) => updateRecommendation(idx, 'yieldVal', v)} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
               <TextArea label="Layers" value={rec.layers} onChange={(v) => updateRecommendation(idx, 'layers', v)} rows={2} />
               <Input label="Casing" value={rec.casing} onChange={(v) => updateRecommendation(idx, 'casing', v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Header Color</label>
                  <select 
                    value={rec.priorityColor} 
                    onChange={(e) => updateRecommendation(idx, 'priorityColor', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="bg-green-600">Green</option>
                    <option value="bg-cyan-400">Cyan</option>
                    <option value="bg-orange-400">Orange</option>
                    <option value="bg-gray-300">Gray</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Row Color</label>
                  <select 
                    value={rec.rowColor} 
                    onChange={(e) => updateRecommendation(idx, 'rowColor', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                  >
                     <option value="bg-green-600">Green</option>
                    <option value="bg-cyan-400">Cyan</option>
                    <option value="bg-orange-400">Orange</option>
                    <option value="bg-gray-200">Gray Light</option>
                  </select>
               </div>
            </div>
          </div>
        ))}
        <button 
          onClick={addRecommendation}
          className="w-full py-2 flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded text-gray-400 hover:text-white hover:border-gray-400 transition-all"
        >
          <Plus size={16} /> Add Table Row
        </button>
      </Section>

      <Section title="Important Note">
        <TextArea label="Note Content" value={data.note} onChange={(v) => handleChange('note', v)} rows={4} />
      </Section>

      <Section title="Remarks">
         <div className="space-y-3">
            {data.remarks.map((rem, idx) => (
               <div key={idx} className="flex gap-2 items-start">
                  <span className="text-gray-500 pt-2">{idx + 1}.</span>
                  <TextArea label="" value={rem} onChange={(v) => updateRemark(idx, v)} rows={2} />
                  <button 
                    onClick={() => removeRemark(idx)}
                    className="mt-2 text-gray-500 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
               </div>
            ))}
            <button 
               onClick={addRemark}
               className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
            >
               <Plus size={14} /> Add Remark Point
            </button>
         </div>
      </Section>

    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className="border-b border-gray-800 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left font-semibold text-white mb-4 hover:text-blue-400 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="space-y-4">{children}</div>}
    </div>
  );
};

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; rows?: number }> = ({ label, value, onChange, rows = 3 }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
    <textarea 
      rows={rows}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-y"
    />
  </div>
);

const ImageUploader: React.FC<{ label: string; preview: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void }> = ({ label, preview, onChange, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-500 mb-2">{label}</label>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded flex items-center justify-center overflow-hidden shrink-0">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <span className="text-[10px] text-gray-600">None</span>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={onChange} 
            accept="image/*"
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white py-1.5 px-3 rounded text-xs transition-colors"
          >
            <Upload size={14} /> Upload Image
          </button>
          {preview && (
            <button 
              onClick={() => {
                onClear();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-xs text-red-400 hover:text-red-300 text-left"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FontSelector: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
   <div className="w-full">
      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
         <Type size={12} /> {label}
      </label>
      <select 
         value={value} 
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
      >
         {FONT_OPTIONS.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
         ))}
      </select>
   </div>
);
