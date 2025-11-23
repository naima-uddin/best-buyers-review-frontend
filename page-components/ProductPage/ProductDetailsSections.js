// components/ProductDetailsSections.js
import { Check, Star, Award, Users, HelpCircle, Palette, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from 'react';

export const ColorsSection = ({ colors }) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Palette className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Available Colors</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ 
                backgroundColor: color.name?.toLowerCase() || '#ccc',
                backgroundColor: color.hex || color.code || color.name?.toLowerCase() || '#ccc'
              }}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {color.name || color}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StylesSection = ({ styles }) => {
  if (!styles || styles.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Award className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Available Styles & Variants</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {styles.map((style, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200"
          >
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">
              {typeof style === 'string' ? style.trim() : style}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FactorsToConsiderSection = ({ factors }) => {
  if (!factors || factors.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <HelpCircle className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Key Considerations</h2>
      </div>
      <div className="space-y-4">
        {factors.map((factor, index) => (
          <div
            key={index}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">
                {typeof factor === 'string' ? factor : factor.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MostImportantFactorsSection = ({ factors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!factors) return null;

  const paragraphs = factors.text.split('\n\n').filter(p => p.trim());

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 hover:border-gray-300 transition-all duration-200">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1 -m-1 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
              {factors.heading || "Most Important Factors"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {paragraphs.length} key considerations • Click to {isExpanded ? 'collapse' : 'expand'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
            {paragraphs.length} factors
          </span>
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
            )}
          </div>
        </div>
      </button>

      {/* Collapsible Content - Compact List Design */}
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
      `}>
        <div className="space-y-2">
          {paragraphs.map((paragraph, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-150 group/item"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-white rounded-md border border-gray-300 flex items-center justify-center shadow-xs group-hover/item:shadow-sm transition-shadow">
                <span className="text-xs font-bold text-gray-700 group-hover/item:text-blue-700">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">
                {paragraph.split('\n').map((line, lineIndex, array) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < array.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Compact Summary */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-blue-700 font-medium">
              These factors represent the most critical aspects that will impact your satisfaction with this product.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConclusionSection = ({ conclusion }) => {
  if (!conclusion) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 mb-6 border border-blue-200">
      <div className="flex items-center mb-4">
        <Award className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">
          {conclusion.heading || "Final Verdict"}
        </h2>
      </div>
      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed text-lg font-medium">
          {conclusion.text}
        </div>
      </div>
    </div>
  );
};
