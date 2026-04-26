import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConsentPage from './components/ConsentPage';
import EnhancedPatientForm from './components/EnhancedPatientForm';
import FileUpload from './components/FileUpload';
import UltimateResultsDashboard from './components/UltimateResultsDashboard';
import { PatientFormData, TestResult } from './types/patient';
import { patientService, uploadService, aiService } from './services/api';

const AppRouter: React.FC = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [patientData, setPatientData] = useState<PatientFormData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiMethod, setAiMethod] = useState<string>('Traditional');

  const handleConsent = (accepted: boolean) => {
    setConsentGiven(accepted);
    if (!accepted) {
      // Handle decline - could redirect to goodbye page or show message
      alert('Thank you for your time. You cannot proceed without accepting the consent terms.');
    }
  };

  const handlePatientSubmit = async (data: PatientFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const patient = await patientService.createPatient(data);
      setPatientData(data);
      console.log('Patient created:', patient);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setError('Please upload a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting analysis...');
      
      // Upload file with progress indication
      console.log('Uploading file:', uploadedFile.name);
      const uploadResult = await uploadService.uploadFile(uploadedFile, 'image');
      console.log('Upload result:', uploadResult);
      
      // Check if upload returned a valid URL
      if (!uploadResult.url) {
        throw new Error('File upload failed: no URL returned');
      }
      
      // Analyze with AI service
      console.log('Analyzing image at URL:', uploadResult.url);
      const aiResult = await aiService.analyzeImage(uploadResult.url);
      console.log('AI result:', aiResult);
      
      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI analysis failed');
      }

      // Determine AI method from response
      const method = aiResult.analysis_method || 'Traditional';
      setAiMethod(method);

      // Create test result with enhanced data
      const result: TestResult = {
        testId: `test_${Date.now()}`,
        date: new Date(),
        doshaPrediction: aiResult.data?.doshaPrediction || aiResult.doshaPrediction || 'kapha',
        confidence: aiResult.data?.confidence || aiResult.confidence || 0,
        observations: aiResult.data?.observations || aiResult.observations || ['Analysis completed'],
        insights: aiResult.data?.insights || ['AI analysis completed successfully'],
        recommendations: aiResult.data?.recommendations || ['Follow recommended lifestyle changes'],
        remarks: aiResult.data?.insights ? 
          `AI-enhanced analysis: ${aiResult.data.insights.join(', ')}` : 
          'AI-generated analysis based on Taila Bindu Pariksha patterns.',
        imageUrl: uploadResult.url,
      };

      console.log('Setting test result:', result);
      setTestResult(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to analyze image. Please try again.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Analysis timed out. Please try again with a smaller image.';
      } else if (err.response?.status === 413) {
        errorMessage = 'File too large. Please upload an image smaller than 10MB.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid file format. Please upload a valid image file.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetest = () => {
    setTestResult(null);
    setUploadedFile(null);
    setError(null);
  };

  const handleStartOver = () => {
    setConsentGiven(false);
    setPatientData(null);
    setUploadedFile(null);
    setTestResult(null);
    setError(null);
  };

  // If consent not given, show consent page
  if (!consentGiven) {
    return <ConsentPage onConsent={handleConsent} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-cream-100">
        {/* Navigation Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-cream-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-cream-100 font-display font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-2xl font-display text-brand-900">AyurTaila AI</h1>
                  <p className="text-xs text-brand-400 font-body uppercase tracking-wider">Ayurvedic Diagnostics</p>
                </div>
              </div>
              <button
                onClick={handleStartOver}
                className="px-4 py-2 text-brand-500 hover:text-brand-700 text-sm font-body transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-6">
                <div className={`flex items-center ${patientData ? 'text-brand-900' : 'text-cream-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all ${
                    patientData ? 'bg-brand-900 text-cream-100 shadow-glow' : 'bg-cream-200 text-cream-700'
                  }`}>
                    1
                  </div>
                  <span className="ml-3 text-sm font-body font-medium">Patient Info</span>
                </div>
                <div className={`flex items-center ${uploadedFile ? 'text-brand-900' : 'text-cream-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all ${
                    uploadedFile ? 'bg-brand-900 text-cream-100 shadow-glow' : 'bg-cream-200 text-cream-700'
                  }`}>
                    2
                  </div>
                  <span className="ml-3 text-sm font-body font-medium">Upload Test</span>
                </div>
                <div className={`flex items-center ${testResult ? 'text-brand-900' : 'text-cream-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all ${
                    testResult ? 'bg-brand-900 text-cream-100 shadow-glow' : 'bg-cream-200 text-cream-700'
                  }`}>
                    3
                  </div>
                  <span className="ml-3 text-sm font-body font-medium">Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200/60 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-700 font-body">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Routes>
            <Route 
              path="/" 
              element={
                !patientData ? (
                  <EnhancedPatientForm onSubmit={handlePatientSubmit} loading={loading} />
                ) : !testResult ? (
                  <div className="space-y-8">
                    <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-emerald-700 font-body font-medium">Patient information saved successfully!</p>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-display text-brand-900 mb-6">Upload Oil Drop Test</h2>
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        loading={loading}
                        accept="image/*"
                      />
                      {uploadedFile && !loading && (
                        <div className="mt-8 text-center">
                          <div className="bg-cream-50 rounded-xl p-4 inline-block mb-4">
                            <p className="text-sm text-brand-600 font-body">Selected: <span className="font-medium text-brand-800">{uploadedFile.name}</span></p>
                          </div>
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={handleAnalyze}
                              disabled={loading}
                              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {error ? 'Retry Analysis' : 'Analyze Image'}
                            </button>
                            {error && (
                              <button
                                onClick={() => { setUploadedFile(null); setError(null); }}
                                className="btn-outline"
                              >
                                Change File
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      {loading && (
                        <div className="flex items-center justify-center mt-12">
                          <div className="text-center max-w-md">
                            <div className="w-20 h-20 rounded-2xl bg-brand-900/10 flex items-center justify-center mx-auto mb-6 relative">
                              <div className="absolute w-16 h-16 rounded-full border-4 border-brand-900/20 border-t-brand-900 animate-spin"></div>
                              <div className="w-6 h-6 bg-brand-900 rounded-full"></div>
                            </div>
                            <h3 className="text-2xl font-display text-brand-900 mb-3">Analyzing your pattern...</h3>
                            <p className="text-brand-500 font-body mb-4">Our AI is examining the patterns to determine your Dosha profile</p>
                            <div className="w-full bg-cream-200 rounded-full h-2 mb-4">
                              <div className="bg-brand-900 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                            </div>
                            <p className="text-sm text-brand-400 font-body">This usually takes 10-30 seconds</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <UltimateResultsDashboard
                    testResult={testResult}
                    patientName={patientData.name}
                    onRetest={handleRetest}
                    aiMethod={aiMethod}
                  />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRouter;
