import React from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  ChevronRight,
  LayoutTemplate,
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-5xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="space-y-6 flex flex-col items-center">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-2xl mb-2">
            <img
              src="/images/logo.png"
              className="w-20 h-20 object-contain"
              alt="AGS Logo"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Aqua Geo Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 font-medium">
              This is Production Version
            </p>
          </div>

          <p className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Create professional, standardized groundwater survey reports in
            minutes. Edit locally, preview instantly, and export to PDF or Word.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 text-left px-4">
          <FeatureCard
            icon={<LayoutTemplate className="text-blue-400 w-6 h-6" />}
            title="Smart Editor"
            desc="Intuitive form-based inputs with real-time standardized formatting."
          />
          <FeatureCard
            icon={<Download className="text-green-400 w-6 h-6" />}
            title="Dual Export"
            desc="Generate high-resolution PDFs and editable DOCX files instantly."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-cyan-400 w-6 h-6" />}
            title="Company Standard"
            desc="Pre-configured layouts ensuring 100% brand consistency."
          />
        </div>

        {/* CTA */}
        <div className="pt-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.7)] ring-1 ring-white/20 hover:scale-105 active:scale-95"
          >
            Start New Report
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-gray-500 mt-6">
            Runs securely in your browser • No installation required
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-gray-700 font-mono">
        AGS Internal Tool v1.2
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="p-6 rounded-2xl bg-gray-900/50 border border-white/5 hover:bg-gray-800/50 transition-colors backdrop-blur-sm hover:border-white/10 group">
    <div className="mb-4 p-3 bg-gray-800 rounded-xl inline-block w-fit group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-gray-100 group-hover:text-white transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
      {desc}
    </p>
  </div>
);
