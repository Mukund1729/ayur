import React, { useState } from 'react';
import { TestResult } from '../types/patient';

interface EnhancedResultsDashboardProps {
  testResult: TestResult;
  patientName: string;
  onRetest?: () => void;
  onViewHistory?: () => void;
  aiMethod?: string;
}

const EnhancedResultsDashboard: React.FC<EnhancedResultsDashboardProps> = ({
  testResult,
  patientName,
  onRetest,
  onViewHistory,
  aiMethod = 'Traditional'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const getDoshaColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return { bg: 'bg-sky-500', text: 'text-sky-600', light: 'bg-sky-50', border: 'border-sky-200' };
      case 'pitta':
        return { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' };
      case 'kapha':
        return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  const getDoshaDescription = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return {
          title: 'Vata Dosha',
          elements: 'Air & Space',
          qualities: 'Dry, Light, Cold, Rough, Subtle, Mobile',
          description: 'Vata governs movement and communication in the body. When balanced, it promotes creativity and flexibility.',
          bodyTypes: 'Thin, light frame, dry skin',
          tendencies: 'Creative, enthusiastic, quick to learn',
          imbalances: 'Anxiety, constipation, dry skin, joint pain'
        };
      case 'pitta':
        return {
          title: 'Pitta Dosha',
          elements: 'Fire & Water',
          qualities: 'Hot, Sharp, Oily, Light, Mobile',
          description: 'Pitta governs digestion and metabolism. When balanced, it promotes intelligence and courage.',
          bodyTypes: 'Medium build, warm skin, moles/freckles',
          tendencies: 'Intelligent, ambitious, organized',
          imbalances: 'Acid reflux, inflammation, anger, skin rashes'
        };
      case 'kapha':
        return {
          title: 'Kapha Dosha',
          elements: 'Earth & Water',
          qualities: 'Heavy, Slow, Cold, Oily, Stable',
          description: 'Kapha governs structure and stability. When balanced, it promotes love and patience.',
          bodyTypes: 'Heavy, solid build, oily skin',
          tendencies: 'Calm, patient, loving',
          imbalances: 'Weight gain, depression, congestion, lethargy'
        };
      default:
        return {
          title: 'Unknown Dosha',
          elements: 'Unknown',
          qualities: 'Unknown',
          description: 'Unable to determine dosha type.',
          bodyTypes: 'Unknown',
          tendencies: 'Unknown',
          imbalances: 'Unknown'
        };
    }
  };

  const colors = getDoshaColor(testResult.doshaPrediction);
  const doshaInfo = getDoshaDescription(testResult.doshaPrediction);

  const generatePDFReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Placeholder for PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('PDF report would be downloaded here');
    } catch (error) {
      alert('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const ConfidenceBar = ({ confidence }: { confidence: number }) => {
    const getColor = () => {
      if (confidence >= 80) return 'bg-green-500';
      if (confidence >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Confidence Level</span>
          <span className="font-semibold">{confidence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`${getColor()} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AyurTaila Analysis Results</h1>
              <p className="text-gray-600 mt-1">Patient: {patientName}</p>
              <p className="text-sm text-gray-500">
                Test Date: {new Date(testResult.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${colors.light} ${colors.text} border ${colors.border}`}>
                {aiMethod} Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Main Result Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${colors.bg} text-white mb-4`}>
              <span className="text-3xl font-bold">
                {testResult.doshaPrediction.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className={`text-4xl font-bold ${colors.text} mb-2`}>
              {doshaInfo.title}
            </h2>
            <p className="text-gray-600 text-lg mb-4">{doshaInfo.elements}</p>
            <ConfidenceBar confidence={testResult.confidence} />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {['overview', 'details', 'recommendations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? `${colors.text} border-current`
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${colors.light} p-6 rounded-lg border ${colors.border}`}>
                  <h3 className={`font-semibold ${colors.text} mb-3`}>Qualities</h3>
                  <p className="text-gray-700">{doshaInfo.qualities}</p>
                </div>
                <div className={`${colors.light} p-6 rounded-lg border ${colors.border}`}>
                  <h3 className={`font-semibold ${colors.text} mb-3`}>Description</h3>
                  <p className="text-gray-700">{doshaInfo.description}</p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className={`${colors.light} p-6 rounded-lg border ${colors.border}`}>
                  <h3 className={`font-semibold ${colors.text} mb-3`}>Body Type & Tendencies</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Body Type</h4>
                      <p className="text-gray-600">{doshaInfo.bodyTypes}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Personality Tendencies</h4>
                      <p className="text-gray-600">{doshaInfo.tendencies}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">AI Observations</h3>
                  <ul className="space-y-2">
                    {testResult.observations.map((observation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{observation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className={`${colors.light} p-6 rounded-lg border ${colors.border}`}>
                  <h3 className={`font-semibold ${colors.text} mb-3`}>Health Recommendations</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Dietary Guidelines</h4>
                      <ul className="space-y-1 text-gray-600">
                        {testResult.doshaPrediction === 'vata' && (
                          <>
                            <li>• Warm, cooked foods</li>
                            <li>• Healthy oils and ghee</li>
                            <li>• Root vegetables and sweet fruits</li>
                            <li>• Avoid cold, dry foods</li>
                          </>
                        )}
                        {testResult.doshaPrediction === 'pitta' && (
                          <>
                            <li>• Cool, refreshing foods</li>
                            <li>• Sweet and bitter tastes</li>
                            <li>• Avoid spicy, sour foods</li>
                            <li>• Plenty of water</li>
                          </>
                        )}
                        {testResult.doshaPrediction === 'kapha' && (
                          <>
                            <li>• Light, warm foods</li>
                            <li>• Spicy and bitter tastes</li>
                            <li>• Avoid heavy, oily foods</li>
                            <li>• Limit dairy and sweets</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Lifestyle Tips</h4>
                      <ul className="space-y-1 text-gray-600">
                        {testResult.doshaPrediction === 'vata' && (
                          <>
                            <li>• Regular daily routine</li>
                            <li>• Warm environment</li>
                            <li>• Gentle yoga and meditation</li>
                            <li>• Adequate rest</li>
                          </>
                        )}
                        {testResult.doshaPrediction === 'pitta' && (
                          <>
                            <li>• Cool environment</li>
                            <li>• Moderate exercise</li>
                            <li>• Stress management</li>
                            <li>• Time in nature</li>
                          </>
                        )}
                        {testResult.doshaPrediction === 'kapha' && (
                          <>
                            <li>• Vigorous exercise</li>
                            <li>• Variety in routine</li>
                            <li>• Stay warm and dry</li>
                            <li>• Regular cleansing</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-700 mb-2">Imbalance Signs</h3>
                  <p className="text-gray-700">{doshaInfo.imbalances}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={generatePDFReport}
              disabled={isGeneratingReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingReport ? 'Generating...' : '📄 Download PDF Report'}
            </button>
            
            <button
              onClick={onRetest}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Retest
            </button>
            
            <button
              onClick={onViewHistory}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📊 View History
            </button>
            
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🖨️ Print Results
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            This analysis is based on traditional Ayurvedic principles and AI pattern recognition.
          </p>
          <p className="text-sm mt-1">
            Please consult with a qualified Ayurvedic practitioner for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedResultsDashboard;
