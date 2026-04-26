import React from 'react';
import { TestResult } from '../types/patient';

interface Props {
  testResult: TestResult;
  patientName: string;
}

const QuestionnaireResults: React.FC<Props> = ({ testResult, patientName }) => {
  const q = testResult.questionnaire;

  const renderCheckbox = (checked: boolean, label: string) => (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 rounded border-2 ${checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
        {checked && <span className="text-white text-xs">✓</span>}
      </div>
      <span className="text-gray-700">{label}</span>
    </div>
  );

  const renderRadio = (value: string, options: string[]) => (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full border-2 ${value === option ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
            {value === option && <span className="text-white text-xs">•</span>}
          </div>
          <span className="text-gray-700">{option}</span>
        </div>
      ))}
    </div>
  );

  return (
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
            <p className="text-sm text-gray-600 mb-2">Sample ID</p>
            <p className="font-medium text-gray-800">{q?.section1_basicDetails?.sampleId || 'AUTO-GENERATED'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Group Type</p>
            {renderRadio(
              q?.section1_basicDetails?.groupType || 'Healthy (Group B)',
              ['Healthy (Group B)', 'Diseased (Group A)']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Time of Capture</p>
            <p className="font-medium text-gray-800">{q?.section1_basicDetails?.timeOfCapture || 'Morning'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Lighting Condition</p>
            {renderRadio(
              q?.section1_basicDetails?.lightingCondition || 'Natural Light',
              ['Natural Light', 'Artificial Light', 'Low Light']
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Oil Drop Shape Analysis */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Section 2: Oil Drop Shape Analysis</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">What is the primary shape of the oil droplet?</p>
            {renderRadio(
              q?.section2_shapeAnalysis?.primaryShape || 'Circular',
              ['Circular', 'Oval', 'Irregular', 'Fragmented']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Is the boundary clearly defined?</p>
            {renderRadio(
              q?.section2_shapeAnalysis?.boundaryDefined || 'Sharp',
              ['Sharp', 'Slightly Diffused', 'Blurred']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Is there any elongation present?</p>
            {renderRadio(
              q?.section2_shapeAnalysis?.elongation || 'No',
              ['No', 'Mild', 'Moderate', 'High']
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Movement & Direction */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🔄 Section 3: Movement & Direction</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Does the droplet show directional movement?</p>
            {renderRadio(
              q?.section3_movement?.movementLevel || 'No movement',
              ['No movement', 'Minimal movement', 'Moderate movement', 'Rapid movement']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Direction of movement</p>
            {renderRadio(
              q?.section3_movement?.direction || 'No movement',
              ['North', 'South', 'East', 'West', 'Multiple directions']
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Splitting & Droplet Count */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💧 Section 4: Splitting & Droplet Count</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Is splitting observed?</p>
            {renderRadio(
              q?.section4_splitting?.splittingObserved || 'No',
              ['Yes', 'No']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Number of droplets formed</p>
            {renderRadio(
              q?.section4_splitting?.dropletCount || 'Single',
              ['Single', 'Two', 'Multiple']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Time taken for splitting (in seconds)</p>
            <p className="font-medium text-gray-800">{q?.section4_splitting?.splittingTime || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Section 5: Spread & Surface Interaction */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🌊 Section 5: Spread & Surface Interaction</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Type of spread</p>
            {renderRadio(
              q?.section5_spread?.spreadType || 'No spread',
              ['No spread', 'Uniform spread', 'Irregular spread']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Surface behavior</p>
            {renderRadio(
              q?.section5_spread?.surfaceBehavior || 'Stable',
              ['Stable', 'Vibrating', 'Dispersing']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Any ring formation?</p>
            {renderRadio(
              q?.section5_spread?.ringFormation || 'No',
              ['Yes', 'No']
            )}
          </div>
        </div>
      </div>

      {/* Section 6: Ayurvedic Pattern Interpretation */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🌿 Section 6: Ayurvedic Pattern Interpretation</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Observed Dosha dominance (based on pattern)</p>
            {renderRadio(
              q?.section6_ayurvedicPattern?.doshaDominance || 'Vata',
              ['Vata', 'Pitta', 'Kapha', 'Mixed']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Pattern nature</p>
            {renderRadio(
              q?.section6_ayurvedicPattern?.patternNature || 'Normal',
              ['Normal', 'Mild imbalance', 'Moderate imbalance', 'Severe disturbance']
            )}
          </div>
        </div>
      </div>

      {/* Section 7: Observation Notes */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Section 7: Observation Notes</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Any unique pattern observed?</p>
            <p className="font-medium text-gray-800 bg-white p-3 rounded border">{q?.section7_observationNotes?.uniquePattern || 'No unique pattern observed'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">External factors affecting observation</p>
            {renderRadio(
              q?.section7_observationNotes?.externalFactors || 'None',
              ['Light reflection', 'Surface texture', 'Camera quality', 'None']
            )}
          </div>
        </div>
      </div>

      {/* Section 8: AI Classification Output */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Section 8: AI Classification Output</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Prognosis</p>
            {renderRadio(
              q?.section8_aiClassification?.prognosis || 'Sadhya (Curable)',
              ['Sadhya (Curable)', 'Asadhya (Incurable)']
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">{q?.section8_aiClassification?.confidenceScore || testResult.confidence}%</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${q?.section8_aiClassification?.confidenceScore || testResult.confidence}%` }}
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
            <p className="text-xl font-bold text-blue-800">{q?.section8_aiClassification?.prognosis || 'Sadhya (Curable)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResults;
