import React from 'react';
import { TestResult } from '../types/patient';

interface Props {
  testResult: TestResult;
  patientName: string;
  onRetest: () => void;
  aiMethod?: string;
}

const getDoshaInfo = (dosha: string) => {
  const data: Record<string, any> = {
    vata: { name: 'Vata', element: 'Air + Ether', bodyType: 'Ectomorph', qualities: ['Dry','Light','Cold','Rough','Subtle'], tendencies: ['Anxiety','Constipation','Dry Skin','Joint Pain'], recommendations: ['Warm, nourishing foods','Regular routine and sleep schedule','Gentle yoga and meditation','Warm oil massages (Abhyanga)','Avoid cold, dry foods'] },
    pitta: { name: 'Pitta', element: 'Fire + Water', bodyType: 'Mesomorph', qualities: ['Hot','Sharp','Oily','Light','Spreading'], tendencies: ['Inflammation','Acidity','Anger','Skin Rashes'], recommendations: ['Cooling, fresh foods','Moderate exercise in cool weather','Stress management techniques','Avoid spicy, oily foods','Practice forgiveness and patience'] },
    kapha: { name: 'Kapha', element: 'Earth + Water', bodyType: 'Endomorph', qualities: ['Heavy','Slow','Cold','Oily','Stable'], tendencies: ['Weight Gain','Depression','Congestion','Lethargy'], recommendations: ['Light, warm, spicy foods','Vigorous exercise and sweating','Variety and stimulation in routine','Regular detoxification','Avoid heavy, cold foods'] }
  };
  return data[dosha] || data.kapha;
};

const UltimateResultsDashboard: React.FC<Props> = ({ testResult, patientName, onRetest, aiMethod }) => {
  console.log('🎉 UltimateResultsDashboard loaded!');
  console.log('📊 TestResult received:', testResult);
  console.log('📋 Questionnaire data:', testResult.questionnaire);
  const doshaInfo = getDoshaInfo(testResult.doshaPrediction);
  const confidenceLevel = testResult.confidence > 80 ? 'high' : testResult.confidence > 60 ? 'medium' : 'low';

  const downloadReport = () => {
    const q = testResult.questionnaire;
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>AyurTaila AI Analysis Report</title>
      <style>
        body { font-family: Inter, sans-serif; margin: 40px; color: #0F172A; background: #FAF7F2; }
        .header { text-align: center; margin-bottom: 40px; padding: 30px; background: white; border-radius: 16px; }
        .section { margin: 30px 0; padding: 25px; background: white; border-radius: 12px; border: 1px solid #E5E7EB; }
        .section-title { font-size: 24px; font-weight: bold; color: #0F172A; margin-bottom: 20px; border-bottom: 2px solid #C4935F; padding-bottom: 10px; }
        .subsection { margin: 20px 0; padding: 15px; background: #F8FAFC; border-radius: 8px; }
        .subsection-title { font-size: 18px; font-weight: 600; color: #1E293B; margin-bottom: 15px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .item { padding: 15px; background: white; border-radius: 8px; border: 1px solid #E5E7EB; }
        .label { font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .value { font-size: 16px; font-weight: 500; color: #0F172A; }
        .dosha-card { padding: 30px; text-align: center; border-radius: 16px; margin: 20px 0; background: linear-gradient(135deg, ${doshaInfo.name === 'Vata' ? '#8B5CF6,#7C3AED' : doshaInfo.name === 'Pitta' ? '#EF4444,#DC2626' : '#3B82F6,#2563EB'}); color: white; }
        .observation { margin: 10px 0; padding: 10px; background: #F1F5F9; border-left: 4px solid #C4935F; }
        .recommendation { margin: 10px 0; padding: 15px; background: #F0FDF4; border-radius: 8px; border-left: 4px solid #10B981; }
        @media print { body { margin: 20px; } .section { page-break-inside: avoid; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1 style="color:#0F172A;font-size:32px;margin-bottom:10px">AyurTaila AI Analysis Report</h1>
          <p style="color:#64748B">Comprehensive Taila Bindu Pariksha Diagnostic Report</p>
          <p style="color:#94A3B8;font-size:14px">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">👤 Patient Information</div>
          <div class="grid">
            <div class="item"><div class="label">Patient Name</div><div class="value">${patientName}</div></div>
            <div class="item"><div class="label">Test Date</div><div class="value">${new Date(testResult.date).toLocaleDateString()}</div></div>
            <div class="item"><div class="label">Test ID</div><div class="value">${testResult.testId}</div></div>
            <div class="item"><div class="label">Analysis Method</div><div class="value">Gemini AI Vision</div></div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">🎯 Analysis Results Overview</div>
          <div class="dosha-card">
            <h2 style="font-size:36px;margin-bottom:10px">${doshaInfo.name} Dosha</h2>
            <p style="font-size:18px;opacity:0.9">Dominant Constitution Type</p>
            <div style="margin:20px 0">
              <div style="font-size:48px;font-weight:bold">${testResult.confidence}%</div>
              <div style="font-size:16px;opacity:0.8">Confidence Score</div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">Key Observations</div>
            ${testResult.observations.map(obs => `<div class="observation">• ${obs}</div>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">🔬 Comprehensive Analysis Details</div>
          <div class="subsection">
            <div class="subsection-title">📋 Section 1: Basic Image Details</div>
            <div class="grid">
              <div class="item"><div class="label">Sample ID</div><div class="value">${q?.section1_basicDetails?.sampleId || 'AUTO-GENERATED'}</div></div>
              <div class="item"><div class="label">Group Type</div><div class="value">${q?.section1_basicDetails?.groupType || 'Diseased (Group A)'}</div></div>
              <div class="item"><div class="label">Time of Capture</div><div class="value">${q?.section1_basicDetails?.timeOfCapture || 'Morning'}</div></div>
              <div class="item"><div class="label">Lighting Condition</div><div class="value">${q?.section1_basicDetails?.lightingCondition || 'Natural Light'}</div></div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">🔍 Section 2: Oil Drop Shape Analysis</div>
            <div class="grid">
              <div class="item"><div class="label">Primary Shape</div><div class="value">${q?.section2_shapeAnalysis?.primaryShape || 'Oval'}</div></div>
              <div class="item"><div class="label">Boundary Definition</div><div class="value">${q?.section2_shapeAnalysis?.boundaryDefined || 'Slightly Diffused'}</div></div>
              <div class="item"><div class="label">Elongation</div><div class="value">${q?.section2_shapeAnalysis?.elongation || 'Mild'}</div></div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">🔄 Section 3: Movement & Direction</div>
            <div class="grid">
              <div class="item"><div class="label">Movement Level</div><div class="value">${q?.section3_movement?.movementLevel || 'Moderate movement'}</div></div>
              <div class="item"><div class="label">Direction</div><div class="value">${q?.section3_movement?.direction || 'Multiple directions'}</div></div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">💧 Section 4: Splitting & Droplet Count</div>
            <div class="grid">
              <div class="item"><div class="label">Splitting Observed</div><div class="value">${q?.section4_splitting?.splittingObserved || 'No'}</div></div>
              <div class="item"><div class="label">Droplet Count</div><div class="value">${q?.section4_splitting?.dropletCount || 'Single'}</div></div>
              <div class="item"><div class="label">Splitting Time</div><div class="value">${q?.section4_splitting?.splittingTime || 'N/A'}</div></div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">🌊 Section 5: Spread & Surface Interaction</div>
            <div class="grid">
              <div class="item"><div class="label">Spread Type</div><div class="value">${q?.section5_spread?.spreadType || 'Uniform spread'}</div></div>
              <div class="item"><div class="label">Surface Behavior</div><div class="value">${q?.section5_spread?.surfaceBehavior || 'Stable'}</div></div>
              <div class="item"><div class="label">Ring Formation</div><div class="value">${q?.section5_spread?.ringFormation || 'Yes'}</div></div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">🌿 Section 6: Ayurvedic Pattern Interpretation</div>
            <div class="grid">
              <div class="item"><div class="label">Dosha Dominance</div><div class="value">${q?.section6_ayurvedicPattern?.doshaDominance || doshaInfo.name}</div></div>
              <div class="item"><div class="label">Pattern Nature</div><div class="value">${q?.section6_ayurvedicPattern?.patternNature || 'Mild imbalance'}</div></div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection-title">⚠️ Section 7: Observation Notes</div>
            <div class="item"><div class="label">Unique Pattern Observed</div><div class="value">${q?.section7_observationNotes?.uniquePattern || 'Standard oil drop pattern observed'}</div></div>
            <div class="item"><div class="label">External Factors</div><div class="value">${q?.section7_observationNotes?.externalFactors || 'None'}</div></div>
          </div>
          <div class="subsection">
            <div class="subsection-title">📊 Section 8: AI Classification Output</div>
            <div class="grid">
              <div class="item"><div class="label">Prognosis</div><div class="value">${q?.section8_aiClassification?.prognosis || 'Sadhya (Curable)'}</div></div>
              <div class="item"><div class="label">Confidence Score</div><div class="value">${q?.section8_aiClassification?.confidenceScore || testResult.confidence}%</div></div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">🌿 Dosha Characteristics</div>
          <div class="grid">
            <div class="item"><div class="label">Qualities</div><div class="value">${doshaInfo.qualities.join(', ')}</div></div>
            <div class="item"><div class="label">Common Tendencies</div><div class="value">${doshaInfo.tendencies.join(', ')}</div></div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">💡 Personalized Recommendations</div>
          ${doshaInfo.recommendations.map((rec: string, i: number) => `<div class="recommendation"><strong>${i+1}.</strong> ${rec}</div>`).join('')}
        </div>
        
        <div style="text-align:center;margin-top:50px;padding:30px;background:#fff;border-radius:16px">
          <p style="color:#64748B;font-size:14px">This report was generated by AyurTaila AI using advanced computer vision and Ayurvedic principles.</p>
          <p style="color:#94A3B8;font-size:12px;margin-top:10px">© 2024 AyurTaila AI - Advanced Ayurvedic Diagnostic System</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AyurTaila-Analysis-Report-${patientName.replace(/\s+/g,'-')}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => window.print(), 1000);
  };

  const bg = doshaInfo.name === 'Vata' ? 'from-[#2D5A7B] to-[#1A3A52]' : doshaInfo.name === 'Pitta' ? 'from-[#B8754C] to-[#8B5A3C]' : 'from-[#4A7C6F] to-[#2D5248]';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">AyurTaila AI Analysis</h1>
          <p className="text-lg text-gray-600">Comprehensive Taila Bindu Pariksha Report</p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Dosha Prediction */}
            <div className="text-center">
              <div className={`inline-block p-8 rounded-2xl bg-gradient-to-br ${testResult.doshaPrediction === 'vata' ? 'from-purple-500 to-purple-700' : testResult.doshaPrediction === 'pitta' ? 'from-red-500 to-red-700' : 'from-blue-500 to-blue-700'} text-white mb-6 transform transition-all duration-500 hover:scale-105`}>
                <div className="text-6xl mb-4">🌿</div>
                <h2 className="text-3xl font-bold mb-2">{doshaInfo.name}</h2>
                <p className="text-lg opacity-90">{doshaInfo.element}</p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
                  <div className="flex items-center justify-center">
                    <div className="text-3xl font-bold text-gray-800">{testResult.confidence}%</div>
                    <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                      confidenceLevel === 'high' ? 'bg-green-100 text-green-800' :
                      confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {confidenceLevel}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Body Type</p>
                  <p className="text-xl font-semibold text-gray-800">{doshaInfo.bodyType}</p>
                </div>
              </div>
            </div>

            {/* Right: Qualities & Tendencies */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Qualities</h3>
                <div className="flex flex-wrap gap-2">
                  {doshaInfo.qualities.map((quality: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {quality}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Tendencies</h3>
                <div className="space-y-2">
                  {doshaInfo.tendencies.map((tendency: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      <span className="text-gray-700">{tendency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observations & Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600">🔍</span>
              </span>
              Observations
            </h3>
            <div className="space-y-3">
              {testResult.observations.map((obs: string, index: number) => (
                <div key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-blue-600 text-xs">•</span>
                  </span>
                  <p className="text-gray-700">{obs}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600">💡</span>
              </span>
              Insights
            </h3>
            <div className="space-y-3">
              {testResult.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-purple-600 text-xs">•</span>
                  </span>
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600">🌱</span>
            </span>
            Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {doshaInfo.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                  <span className="text-green-600 text-xs">✓</span>
                </span>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questionnaire Results - All 8 Sections */}
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AyurTaila AI Analysis Report</h1>
            <p className="text-gray-600">Patient: {patientName}</p>
            <p className="text-gray-500 text-sm">Date: {new Date(testResult.date).toLocaleDateString()}</p>
          </div>

          {/* Section 1: Basic Details */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Section 1: Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sample ID</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section1_basicDetails?.sampleId || 'AUTO-GENERATED'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Group Type</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section1_basicDetails?.groupType || 'Healthy (Group B)'}</p>
                {testResult.questionnaire?.section1_basicDetails?.groupType === 'Diseased (Group A)' && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">Condition:</p>
                    <p className="font-medium text-gray-800">{testResult.questionnaire?.section1_basicDetails?.diseaseType || 'Prameha Roga'}</p>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time of Capture</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section1_basicDetails?.timeOfCapture || 'Morning'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Lighting Condition</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section1_basicDetails?.lightingCondition || 'Natural Light'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Oil Drop Shape Analysis */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Section 2: Oil Drop Shape Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Primary Shape</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section2_shapeAnalysis?.primaryShape || 'Circular'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Boundary Defined</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section2_shapeAnalysis?.boundaryDefined || 'Sharp'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Elongation</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section2_shapeAnalysis?.elongation || 'No'}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Movement & Direction */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔄 Section 3: Movement & Direction</h2>
            <div className="space-y-6">
              {/* Movement Level with Visual Indicator */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Movement Level Analysis</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-lg">{testResult.questionnaire?.section3_movement?.movementLevel || 'No movement'}</p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${testResult.questionnaire?.section3_movement?.movementLevel === 'No movement' ? 'bg-green-500' : testResult.questionnaire?.section3_movement?.movementLevel === 'Minimal movement' ? 'bg-yellow-500' : testResult.questionnaire?.section3_movement?.movementLevel === 'Moderate movement' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">Intensity</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="text-blue-600 text-xs font-medium">MOVEMENT</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direction Analysis with Compass */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Direction Analysis</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-lg">{testResult.questionnaire?.section3_movement?.direction || 'No movement'}</p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${testResult.questionnaire?.section3_movement?.direction === 'North' ? 'bg-blue-500' : testResult.questionnaire?.section3_movement?.direction === 'South' ? 'bg-green-500' : testResult.questionnaire?.section3_movement?.direction === 'East' ? 'bg-yellow-500' : testResult.questionnaire?.section3_movement?.direction === 'West' ? 'bg-red-500' : 'bg-purple-500'}`}></div>
                        <span className="text-sm text-gray-600">Direction</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center relative">
                      <div className="text-green-600 text-xs font-medium">N</div>
                      <div className="absolute top-0 right-0 text-xs text-green-400">↑</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movement Pattern Description */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Movement Pattern Description</p>
                <p className="text-gray-700 leading-relaxed">
                  {testResult.questionnaire?.section3_movement?.movementLevel === 'No movement' && 'Oil droplet remains stable with minimal directional movement'}
                  {testResult.questionnaire?.section3_movement?.movementLevel === 'Minimal movement' && 'Slight directional movement observed with gentle spreading pattern'}
                  {testResult.questionnaire?.section3_movement?.movementLevel === 'Moderate movement' && 'Clear directional movement with moderate spreading velocity'}
                  {testResult.questionnaire?.section3_movement?.movementLevel === 'Rapid movement' && 'Fast directional movement with rapid spreading pattern'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Splitting & Droplet Count */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">💧 Section 4: Splitting & Droplet Count</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Splitting Observed</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section4_splitting?.splittingObserved || 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Droplet Count</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section4_splitting?.dropletCount || 'Single'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Splitting Time</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section4_splitting?.splittingTime || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Spread & Surface Interaction */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🌊 Section 5: Spread & Surface Interaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Spread Type</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section5_spread?.spreadType || 'No spread'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Surface Behavior</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section5_spread?.surfaceBehavior || 'Stable'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ring Formation</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section5_spread?.ringFormation || 'No'}</p>
              </div>
            </div>
          </div>

          {/* Section 6: Ayurvedic Pattern Interpretation */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🌿 Section 6: Ayurvedic Pattern Interpretation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dosha Dominance</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section6_ayurvedicPattern?.doshaDominance || 'Vata'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pattern Nature</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section6_ayurvedicPattern?.patternNature || 'Normal'}</p>
              </div>
            </div>
          </div>

          {/* Section 7: Observation Notes */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Section 7: Observation Notes</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Any unique pattern observed?</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section7_observationNotes?.uniquePattern || 'No unique pattern observed'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pattern isolation (detecting swirl, spread, or ring formation)</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section7_observationNotes?.patternIsolation || 'Standard circular pattern observed'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Color density mapping (for dosha identification clues)</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section7_observationNotes?.colorDensityMapping || 'Uniform color distribution observed'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">External factors affecting observation</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section7_observationNotes?.externalFactors || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Section 8: AI Classification Output */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Section 8: AI Classification Output</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prognosis</p>
                <p className="font-medium text-gray-800">{testResult.questionnaire?.section8_aiClassification?.prognosis || 'Sadhya (Curable)'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-blue-600">{testResult.questionnaire?.section8_aiClassification?.confidenceScore || testResult.confidence}%</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${testResult.questionnaire?.section8_aiClassification?.confidenceScore || testResult.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-1">Dominant Dosha</p>
                <p className="text-xl font-bold text-blue-800">{testResult.doshaPrediction.toUpperCase()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-1">Confidence</p>
                <p className="text-xl font-bold text-blue-800">{testResult.confidence}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-1">Prognosis</p>
                <p className="text-xl font-bold text-blue-800">{testResult.questionnaire?.section8_aiClassification?.prognosis || 'Sadhya (Curable)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={downloadReport}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            📄 Download Report
          </button>
          <button
            onClick={onRetest}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🔄 Retest
          </button>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Important Medical Disclaimer</h3>
          <p className="text-red-700 text-sm leading-relaxed">
            This digital report is for research and educational use only. It should not be used as a standalone clinical diagnostic tool and must be interpreted by a qualified healthcare professional.
          </p>
          <p className="text-red-600 text-xs mt-2">
            Always consult with a licensed Ayurvedic practitioner or medical doctor for proper diagnosis and treatment recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UltimateResultsDashboard;
