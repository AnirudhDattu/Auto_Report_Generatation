
import React, { useState } from 'react';
import { ReportData, RecommendationRow, FontConfig } from '../types';
import { 
  ChevronDown, ChevronUp, Plus, Trash2, X, Type, MapPin, 
  Info, User, FileText, Layers, Droplets, Activity,
  Settings, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';

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

// Color options for the visual picker
const PRIORITY_COLORS = [
  { value: 'bg-green-600', label: 'Green', class: 'bg-green-600' },
  { value: 'bg-cyan-400', label: 'Cyan', class: 'bg-cyan-400' },
  { value: 'bg-orange-400', label: 'Orange', class: 'bg-orange-400' },
  { value: 'bg-gray-300', label: 'Gray', class: 'bg-gray-300' },
];

const ROW_COLORS = [
  { value: 'bg-green-600', label: 'Green', class: 'bg-green-600' },
  { value: 'bg-cyan-400', label: 'Cyan', class: 'bg-cyan-400' },
  { value: 'bg-orange-400', label: 'Orange', class: 'bg-orange-400' },
  { value: 'bg-gray-200', label: 'Light', class: 'bg-gray-200' },
];

// Smart suggestions mapping Label -> Full Text
const SMART_SUGGESTIONS = {
  physiography: [
    { label: "Sloping/Drainage", text: "There is no river course present near the above-said investigated land. However, some first-order drainage patterns were observed on the sloping land surface." },
    { label: "Ridge Portion", text: "There is no river course present near the above-said investigated land. The area is situated mostly on a ridge portion." },
    { label: "Flat Terrain", text: "The area consists of flat terrain with no significant drainage patterns observed in the immediate vicinity." }
  ],
  topographical: [
    { label: "Mixed/Ridge", text: "The investigated land got different topographical Observations mostly ridge portions, upland areas, and sloping land surface places." },
    { label: "Sloping", text: "The investigated land is characterized mostly by sloping land surface with undulating terrain." },
    { label: "Plain", text: "The investigated land is mostly a plain area with minimal undulations." }
  ],
  geological: [
    { label: "Granite/Sheet Rock", text: "The formation present in the land is the ARCHEAN group of rocks. The lithology of the area is mostly fractured and semi-fractured granite. Most of the area is covered with granitic sheet rock." },
    { label: "Weathered/Soil", text: "The formation present in the land is the ARCHEAN group of rocks. The lithology consists of weathered soil cover followed by semi-fractured granite." },
    { label: "Fractured", text: "The formation is ARCHEAN. The area is characterized by highly fractured granite with good lineament intersections." }
  ],
  hydrological: [
    { label: "Mixed (Mod/Fav)", text: "Hydrological conditions of the above-said land are moderately favorable in some parts of the land and Favorable in some other parts." },
    { label: "Favorable", text: "Hydrological conditions of the above-said land are highly Favorable due to the presence of interconnected fractures." },
    { label: "Poor", text: "Hydrological conditions of the above-said land are Poor due to the massive nature of the rock and lack of recharge sources." }
  ],
  rocks: [
    { label: "None", text: "No Dolerite Intrusive rocks presence was observed in and around the above said investigated land." },
    { label: "Dolerite Dyke", text: "Intrusive rocks (Dolerite Dyke) were observed passing through the investigated area." },
    { label: "Quartz", text: "Quartz veins were observed intruding the granitic formation in the surveyed area." }
  ],
  groundwater: [
    { label: "Satisfactory", text: "Bore wells / open wells present in and around the site are yielding SATISFACTORILY." },
    { label: "Good Yield", text: "Bore wells / open wells present in and around the site are yielding GOOD quantity of water." },
    { label: "Poor/Dry", text: "Bore wells / open wells present in and around the site are yielding POORLY or are dry." }
  ],
  geoResults: [
    { label: "Mod. Favorable", text: "Moderately Favorable Results Obtained." },
    { label: "Favorable", text: "Favorable Results Obtained indicating potential aquifer zones." },
    { label: "High Resistivity", text: "High resistivity values obtained, indicating massive rock formation." }
  ]
};

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
    if (window.confirm("Are you sure you want to delete this row?")) {
        const newRecs = [...data.recommendations];
        newRecs.splice(index, 1);
        handleChange('recommendations', newRecs);
    }
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
    <div className="flex flex-col gap-5 p-4 md:p-6 text-sm text-gray-300 pb-24 md:pb-6">
      
      {/* --- SETTINGS GROUP --- */}
      <Section title="Report Settings" icon={<Settings size={18} />} defaultOpen>
        <div className="grid grid-cols-1 gap-4">
            <Input label="Surveyor Name (Footer)" value={data.surveyorName} onChange={(v) => handleChange('surveyorName', v)} placeholder="e.g. GANESH RAJ" />
            <Input label="Output Filename" value={data.fileName} onChange={(v) => handleChange('fileName', v)} placeholder="Report_ClientName" />
            
            {/* Typography Sub-section */}
            <div className="mt-2 bg-[#0F1623] p-4 rounded-xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                   <Type size={14} className="text-blue-400" />
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Typography</span>
                </div>
                <FontSelector 
                   label="Global Font Family" 
                   value={data.fonts.global} 
                   onChange={(v) => handleFontChange('global', v)} 
                />
            </div>
        </div>
      </Section>

      {/* --- CLIENT INFO GROUP --- */}
      <Section title="Client & Survey Info" icon={<User size={18} />} defaultOpen>
        <div className="grid grid-cols-2 gap-4 mb-4">
             <Input label="Serial No." numeric value={data.sNo} onChange={(v) => handleChange('sNo', v)} />
             <Input label="Date" value={data.date} onChange={(v) => handleChange('date', v)} />
        </div>
        <TextArea label="To Address" value={data.toAddress} onChange={(v) => handleChange('toAddress', v)} rows={3} />
      </Section>

      {/* --- SITE DETAILS GROUP --- */}
      <Section title="Site Details" icon={<MapPin size={18} />}>
        <div className="space-y-4">
            <TextArea label="Location" value={data.location} onChange={(v) => handleChange('location', v)} rows={3} />
            <div className="grid grid-cols-1 gap-4">
                <TextArea label="Physiography" value={data.physiography} onChange={(v) => handleChange('physiography', v)} rows={3} suggestions={SMART_SUGGESTIONS.physiography} />
                <TextArea label="Topography" value={data.topographical} onChange={(v) => handleChange('topographical', v)} rows={3} suggestions={SMART_SUGGESTIONS.topographical} />
                <TextArea label="Geological Condition" value={data.geological} onChange={(v) => handleChange('geological', v)} rows={3} suggestions={SMART_SUGGESTIONS.geological} />
            </div>
        </div>
      </Section>

      {/* --- BEDS GROUP --- */}
      <Section title="Bed Thickness" icon={<Layers size={18} />}>
        <div className="bg-[#0F1623] p-4 rounded-xl border border-gray-800 space-y-3">
            <Input label="Over burden (a)" value={data.thicknessBeds.a} onChange={(v) => handleDeepChange('thicknessBeds', 'a', v)} />
            <Input label="Weathered zone (b)" value={data.thicknessBeds.b} onChange={(v) => handleDeepChange('thicknessBeds', 'b', v)} />
            <Input label="Basement depth (c)" value={data.thicknessBeds.c} onChange={(v) => handleDeepChange('thicknessBeds', 'c', v)} />
        </div>
      </Section>

      {/* --- HYDRO GROUP --- */}
      <Section title="Hydro & Geophysics" icon={<Droplets size={18} />}>
        <div className="space-y-4">
            <TextArea label="Hydrological Condition" value={data.hydrological} onChange={(v) => handleChange('hydrological', v)} rows={2} suggestions={SMART_SUGGESTIONS.hydrological} />
            <TextArea label="Intrusive Rocks" value={data.intrusiveRocks} onChange={(v) => handleChange('intrusiveRocks', v)} rows={2} suggestions={SMART_SUGGESTIONS.rocks} />
            <TextArea label="Groundwater Cond." value={data.groundwater} onChange={(v) => handleChange('groundwater', v)} rows={2} suggestions={SMART_SUGGESTIONS.groundwater} />
            
            <div className="p-4 bg-blue-900/10 rounded-xl border border-blue-900/30">
              <div className="flex items-center gap-2 mb-3">
                 <Activity size={14} className="text-blue-400" />
                 <span className="text-xs font-bold text-blue-300 uppercase">Geophysical Survey</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Input label="Survey Type" value={data.geophysical.type} onChange={(v) => handleDeepChange('geophysical', 'type', v)} />
                <Input label="Results" value={data.geophysical.results} onChange={(v) => handleDeepChange('geophysical', 'results', v)} />
                <QuickTags options={SMART_SUGGESTIONS.geoResults} onSelect={(val) => handleDeepChange('geophysical', 'results', val)} />
              </div>
            </div>
        </div>
      </Section>

      {/* --- RECOMMENDATIONS GROUP --- */}
      <Section title="Recommendations" icon={<CheckCircle2 size={18} />} defaultOpen>
        <div className="space-y-4">
            {data.recommendations.map((rec, idx) => (
              <CollapsibleRow 
                 key={rec.id || idx} 
                 title={`Point #${rec.pointNo} - ${rec.depth}ft`} 
                 subtitle={rec.priorityLabel}
                 onDelete={() => removeRecommendation(idx)}
              >
                 <div className="grid grid-cols-1 gap-4 pt-2">
                    {/* Priority Config */}
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <Input label="Priority Title" value={rec.priorityLabel} onChange={(v) => updateRecommendation(idx, 'priorityLabel', v)} />
                        <div className="mt-3">
                             <label className="text-xs text-gray-500 mb-2 block">Priority Label Color</label>
                             <ColorPicker 
                               options={PRIORITY_COLORS} 
                               selected={rec.priorityColor} 
                               onChange={(c) => updateRecommendation(idx, 'priorityColor', c)} 
                             />
                        </div>
                    </div>

                    {/* Data Fields */}
                    <div className="grid grid-cols-2 gap-3">
                       <Input label="Point No" numeric value={rec.pointNo} onChange={(v) => updateRecommendation(idx, 'pointNo', v)} />
                       <Input label="Depth" numeric value={rec.depth} onChange={(v) => updateRecommendation(idx, 'depth', v)} />
                       <Input label="Yield" value={rec.yieldVal} onChange={(v) => updateRecommendation(idx, 'yieldVal', v)} />
                       <Input label="Casing" numeric value={rec.casing} onChange={(v) => updateRecommendation(idx, 'casing', v)} />
                    </div>
                    <TextArea label="Layers" value={rec.layers} onChange={(v) => updateRecommendation(idx, 'layers', v)} rows={2} />

                    {/* Row Config */}
                    <div className="mt-1">
                        <label className="text-xs text-gray-500 mb-2 block">Background Color</label>
                        <ColorPicker 
                           options={ROW_COLORS} 
                           selected={rec.rowColor} 
                           onChange={(c) => updateRecommendation(idx, 'rowColor', c)} 
                        />
                    </div>
                 </div>
              </CollapsibleRow>
            ))}
            
            <button 
              onClick={addRecommendation}
              className="w-full py-4 flex items-center justify-center gap-2 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/5 transition-all text-sm font-medium"
            >
              <Plus size={16} /> Add Recommendation
            </button>
        </div>
      </Section>

      {/* --- FOOTER CONTENT GROUP --- */}
      <Section title="Note & Remarks" icon={<FileText size={18} />}>
        <div className="space-y-6">
           <TextArea label="Disclaimer Note" value={data.note} onChange={(v) => handleChange('note', v)} rows={4} icon={<Info size={14} />} />
           
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-3">Bullet Points (Remarks)</label>
              <div className="space-y-3">
                 {data.remarks.map((rem, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                       <span className="text-gray-600 font-mono text-xs pt-3 w-5">{idx + 1}.</span>
                       <div className="flex-1">
                           <TextArea label="" value={rem} onChange={(v) => updateRemark(idx, v)} rows={2} />
                       </div>
                       <button 
                         onClick={() => removeRemark(idx)}
                         className="mt-2 text-gray-600 hover:text-red-400 p-2"
                       >
                         <X size={16} />
                       </button>
                    </div>
                 ))}
                 <button 
                    onClick={addRemark}
                    className="text-xs flex items-center gap-1.5 text-blue-400 hover:text-white mt-2 px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors w-fit ml-7"
                 >
                    <Plus size={14} /> Add Point
                 </button>
              </div>
           </div>
        </div>
      </Section>

    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden shadow-sm hover:border-gray-700 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full px-4 py-3 bg-[#161e2e] hover:bg-[#1f293a] transition-colors"
      >
        <div className="flex items-center gap-3">
           <span className="text-gray-400">{icon}</span>
           <span className="text-sm font-semibold text-gray-200">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      
      {isOpen && (
         <div className="p-4 border-t border-gray-800/50 animate-in slide-in-from-top-2 duration-200">
            {children}
         </div>
      )}
    </div>
  );
};

// Collapsible Row for Recommendations
const CollapsibleRow: React.FC<{ title: string; subtitle: string; children: React.ReactNode; onDelete: () => void }> = ({ title, subtitle, children, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-[#131B2C] rounded-xl border border-gray-700/50 shadow-sm overflow-hidden">
      <div 
         className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
         onClick={() => setIsOpen(!isOpen)}
      >
         <div className="flex items-center gap-3">
            <div className={`text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
               <ChevronRight size={16} />
            </div>
            <div>
               <p className="font-bold text-gray-200 text-xs">{title}</p>
               <p className="text-[10px] text-gray-500">{subtitle}</p>
            </div>
         </div>
         <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-gray-600 hover:text-red-400 p-2"
         >
            <Trash2 size={16} />
         </button>
      </div>
      {isOpen && <div className="p-4 pt-0 border-t border-gray-800/50">{children}</div>}
    </div>
  );
};

interface SuggestionItem {
  label: string;
  text: string;
}

const QuickTags: React.FC<{ options: SuggestionItem[], onSelect: (val: string) => void }> = ({ options, onSelect }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {options.map((opt) => (
      <button
        key={opt.label}
        onClick={() => onSelect(opt.text)}
        className="flex items-center gap-1 bg-gray-800 hover:bg-blue-900/40 text-[10px] text-gray-400 hover:text-blue-300 px-2.5 py-1 rounded-full border border-gray-700 hover:border-blue-800 transition-all"
        title={opt.text}
      >
        <Sparkles size={10} />
        {opt.label}
      </button>
    ))}
  </div>
);

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; numeric?: boolean }> = ({ label, value, onChange, placeholder, numeric }) => (
  <div className="w-full group">
    {label && <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider group-focus-within:text-blue-400 transition-colors">{label}</label>}
    <input 
      type="text" 
      inputMode={numeric ? "numeric" : "text"}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      className="w-full bg-[#0B1120] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-600"
    />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; rows?: number; icon?: React.ReactNode; suggestions?: SuggestionItem[] }> = ({ label, value, onChange, rows = 3, icon, suggestions }) => (
  <div className="w-full group">
    {label && (
        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider flex items-center gap-1.5 group-focus-within:text-blue-400 transition-colors">
            {icon}
            {label}
        </label>
    )}
    <textarea 
      rows={rows}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full bg-[#0B1120] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-600 resize-y leading-relaxed"
    />
    {suggestions && (
      <QuickTags options={suggestions} onSelect={(val) => {
         // Replaces the content entirely as requested
         onChange(val);
      }} />
    )}
  </div>
);

const FontSelector: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
   <div className="w-full">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0B1120] border border-gray-700 rounded-lg pl-3 pr-8 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-gray-600"
        >
            {FONT_OPTIONS.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
            ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={14} />
        </div>
      </div>
   </div>
);

const ColorPicker: React.FC<{ 
  options: { value: string, label: string, class: string }[], 
  selected: string, 
  onChange: (val: string) => void 
}> = ({ options, selected, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
         <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              relative h-8 flex-1 rounded-md border-2 transition-all group
              ${selected === opt.value ? 'border-white shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-500'}
            `}
            title={opt.label}
         >
           <div className={`w-full h-full rounded-sm ${opt.class}`}></div>
           {/* Tooltip */}
           <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
             {opt.label}
           </span>
         </button>
      ))}
    </div>
  );
};
