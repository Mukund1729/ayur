import React from 'react';
import { TestResult } from '../types/patient';

interface ResultsDashboardProps {
  testResult: TestResult;
  patientName: string;
  onRetest?: () => void;
  onViewHistory?: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  testResult,
  patientName,
  onRetest,
  onViewHistory
}) => {
  const getDoshaColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return 'bg-blue-500';
      case 'pitta':
        return 'bg-red-500';
      case 'kapha':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDoshaBgColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return 'bg-blue-50 border-blue-200';
      case 'pitta':
        return 'bg-red-50 border-red-200';
      case 'kapha':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getDoshaDescription = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return {
          title: 'Vata Dosha',
          elements: 'Air & Space',
          qualities: 'Dry, Light, Cold, Rough, Subtle, Mobile',
          description: 'Vata governs movement and communication in the body. When balanced, it promotes creativity and flexibility.'
        };
      case 'pitta':
        return {
          title: 'Pitta Dosha',
          elements: 'Fire & Water',
          qualities: 'Hot, Sharp, Light, Liquid, Spreading, Oily',
          description: 'Pitta governs digestion and metabolism. When balanced, it promotes intelligence and understanding.'
        };
      case 'kapha':
        return {
          title: 'Kapha Dosha',
          elements: 'Earth & Water',
          qualities: 'Heavy, Slow, Cold, Oily, Sweet, Stable',
          description: 'Kapha governs structure and stability. When balanced, it promotes love and forgiveness.'
        };
      default:
        return {
          title: 'Unknown Dosha',
          elements: 'N/A',
          qualities: 'N/A',
          description: 'Unable to determine Dosha type.'
        };
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const doshaInfo = getDoshaDescription(testResult.doshaPrediction);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Results</h2>
        <p className="text-gray-600">
          Patient: <span className="font-medium">{patientName}</span> | 
          Test Date: <span className="font-medium">{new Date(testResult.date).toLocaleDateString()}</span>
        </p>
      </div>

      {/* Main Result */}
      <div className={`border-2 rounded-lg p-6 mb-6 ${getDoshaBgColor(testResult.doshaPrediction)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 ${getDoshaColor(testResult.doshaPrediction)} rounded-full flex items-center justify-center`}>
              <span className="text-white text-2xl font-bold">
                {testResult.doshaPrediction.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{doshaInfo.title}</h3>
              <p className="text-gray-600">{doshaInfo.elements}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getConfidenceColor(testResult.confidence)}`}>
              {testResult.confidence}%
            </div>
            <div className={`text-sm ${getConfidenceColor(testResult.confidence)}`}>
              {getConfidenceLabel(testResult.confidence)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Key Qualities:</h4>
            <p className="text-gray-600">{doshaInfo.qualities}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
            <p className="text-gray-600">{doshaInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Observations</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="space-y-2">
            {testResult.observations.map((observation, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{observation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Remarks */}
      {testResult.remarks && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Remarks</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-gray-700">{testResult.remarks}</p>
          </div>
        </div>
      )}

      {/* Test Image */}
      {testResult.imageUrl && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Image</h3>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={testResult.imageUrl}
              alt="Oil drop test"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">General Recommendations</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Diet</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {testResult.doshaPrediction === 'vata' && (
                <>
                  <li>â¢ Warm, cooked foods</li>
                  <li>â¢ Healthy oils and fats</li>
                  <li>â¢ Avoid cold, dry foods</li>
                </>
              )}
              {testResult.doshaPrediction === 'pitta' && (
                <>
                  <li>â¢ Cool, refreshing foods</li>
                  <li>â¢ Avoid spicy, oily foods</li>
                  <li>â¢ Sweet and bitter tastes</li>
                </>
              )}
              {testResult.doshaPrediction === 'kapha' && (
                <>
                  <li>â¢ Light, warm foods</li>
                  <li>â¢ Spicy and bitter tastes</li>
                  <li>â¢ Avoid heavy, oily foods</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Lifestyle</h4>
            <ul className="text-sm text-green-800 space-y-1">
              {testResult.doshaPrediction === 'vata' && (
                <>
                  <li>â¢ Regular routine</li>
                  <li>â¢ Gentle exercise</li>
                  <li>â¢ Warm environment</li>
                </>
              )}
              {testResult.doshaPrediction === 'pitta' && (
                <>
                  <li>â¢ Moderate exercise</li>
                  <li>â¢ Stress management</li>
                  <li>â¢ Cool environment</li>
                </>
              )}
              {testResult.doshaPrediction === 'kapha' && (
                <>
                  <li>â¢ Vigorous exercise</li>
                  <li>â¢ Variety in routine</li>
                  <li>â¢ Stay active</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Wellness</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              {testResult.doshaPrediction === 'vata' && (
                <>
                  <li>â¢ Meditation and yoga</li>
                  <li>â¢ Adequate sleep</li>
                  <li>â¢ Self-massage with oil</li>
                </>
              )}
              {testResult.doshaPrediction === 'pitta' && (
                <>
                  <li>â¢ Cooling practices</li>
                  <li>â¢ Time in nature</li>
                  <li>â¢ Relaxation techniques</li>
                </>
              )}
              {testResult.doshaPrediction === 'kapha' && (
                <>
                  <li>â¢ Stimulating activities</li>
                  <li>â¢ Detoxification</li>
                  <li>â¢ New challenges</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t pt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h4>
          <p className="text-yellow-800 text-sm">
            This analysis is based on Ayurvedic principles and AI interpretation of oil drop patterns. 
            It is for informational purposes only and should not replace professional medical advice, 
            diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        {onRetest && (
          <button
            onClick={onRetest}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Perform New Test
          </button>
        )}
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            View Test History
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;
