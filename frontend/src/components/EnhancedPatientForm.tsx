import React, { useState } from 'react';
import { PatientFormData } from '../types/patient';

interface EnhancedPatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  loading: boolean;
}

const EnhancedPatientForm: React.FC<EnhancedPatientFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: '',
    currentSymptoms: '',
    lifestyle: '',
    diet: '',
    sleepPattern: '',
    stressLevel: '',
    exerciseFrequency: '',
    consentGiven: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'basic' | 'lifestyle' | 'health'>('basic');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const sections = [
    { id: 'basic', title: 'Basic Information', icon: '👤' },
    { id: 'lifestyle', title: 'Lifestyle', icon: '🌿' },
    { id: 'health', title: 'Health Details', icon: '🏥' }
  ];

  const renderBasicSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Full Name <span className="text-accent-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input-premium ${errors.name ? 'input-premium-error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Age <span className="text-accent-600">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`input-premium ${errors.age ? 'input-premium-error' : ''}`}
            placeholder="Enter your age"
          />
          {errors.age && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Gender <span className="text-accent-600">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`input-premium ${errors.gender ? 'input-premium-error' : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Email <span className="text-accent-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input-premium ${errors.email ? 'input-premium-error' : ''}`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Phone Number <span className="text-accent-600">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`input-premium ${errors.phone ? 'input-premium-error' : ''}`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="input-premium"
            placeholder="123 Main St, City, State"
          />
        </div>
      </div>
    </div>
  );

  const renderLifestyleSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Diet Type
          </label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleInputChange}
            className="input-premium"
          >
            <option value="">Select Diet Type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Sleep Pattern
          </label>
          <select
            name="sleepPattern"
            value={formData.sleepPattern}
            onChange={handleInputChange}
            className="input-premium"
          >
            <option value="">Select Sleep Pattern</option>
            <option value="regular">Regular (6-8 hours)</option>
            <option value="irregular">Irregular</option>
            <option value="insufficient">Less than 6 hours</option>
            <option value="excessive">More than 9 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Stress Level
          </label>
          <select
            name="stressLevel"
            value={formData.stressLevel}
            onChange={handleInputChange}
            className="input-premium"
          >
            <option value="">Select Stress Level</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Exercise Frequency
          </label>
          <select
            name="exerciseFrequency"
            value={formData.exerciseFrequency}
            onChange={handleInputChange}
            className="input-premium"
          >
            <option value="">Select Exercise Frequency</option>
            <option value="daily">Daily</option>
            <option value="3-4-times">3-4 times per week</option>
            <option value="1-2-times">1-2 times per week</option>
            <option value="rarely">Rarely</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-body font-medium text-brand-800 mb-2">
            Lifestyle Description
          </label>
          <textarea
            name="lifestyle"
            value={formData.lifestyle}
            onChange={handleInputChange}
            rows={4}
            className="input-premium resize-none"
            placeholder="Describe your daily routine, work environment, and lifestyle habits..."
          />
        </div>
      </div>
    </div>
  );

  const renderHealthSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-body font-medium text-brand-800 mb-2">
          Medical History
        </label>
        <textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleInputChange}
          rows={4}
          className="input-premium resize-none"
          placeholder="Please mention any chronic conditions, allergies, or past medical issues..."
        />
      </div>

      <div>
        <label className="block text-sm font-body font-medium text-brand-800 mb-2">
          Current Symptoms
        </label>
        <textarea
          name="currentSymptoms"
          value={formData.currentSymptoms}
          onChange={handleInputChange}
          rows={4}
          className="input-premium resize-none"
          placeholder="Describe any current health concerns or symptoms you're experiencing..."
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 py-10 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-accent-600 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Step 1 of 3</p>
          <h1 className="text-4xl md:text-5xl font-display text-brand-900 mb-3">Patient Information</h1>
          <p className="text-brand-500 font-body max-w-md mx-auto">Provide your details for a personalized Ayurvedic constitutional analysis</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-center">
                <button
                  onClick={() => setActiveSection(section.id as any)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center font-body font-semibold text-sm transition-all duration-500 ${
                    activeSection === section.id
                      ? 'bg-brand-900 text-cream-100 shadow-glow scale-110'
                      : sections.findIndex(s => s.id === activeSection) > index
                      ? 'bg-accent-500 text-white'
                      : 'bg-cream-200 text-cream-800 hover:bg-cream-300'
                  }`}
                >
                  {sections.findIndex(s => s.id === activeSection) > index ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                  {activeSection === section.id && (
                    <span className="absolute -bottom-6 text-xs font-body font-medium text-brand-900 whitespace-nowrap">{section.title}</span>
                  )}
                </button>
                {index < sections.length - 1 && (
                  <div className={`w-16 h-px mx-3 transition-all duration-500 ${
                    sections.findIndex(s => s.id === activeSection) > index ? 'bg-accent-500' : 'bg-cream-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-cream-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            {/* Section Content */}
            <div className="mb-10 min-h-[320px]">
              {activeSection === 'basic' && renderBasicSection()}
              {activeSection === 'lifestyle' && renderLifestyleSection()}
              {activeSection === 'health' && renderHealthSection()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-cream-200">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id as any);
                  }
                }}
                disabled={activeSection === 'basic'}
                className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed text-sm px-6 py-2.5"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {activeSection !== sections[sections.length - 1].id && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      setActiveSection(sections[currentIndex + 1].id as any);
                    }}
                    className="btn-accent text-sm px-6 py-2.5"
                  >
                    Next Step
                  </button>
                )}

                {activeSection === sections[sections.length - 1].id && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm px-6 py-2.5"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Complete
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-accent-50/60 backdrop-blur-sm rounded-xl p-6 border border-accent-200/40">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-brand-900 text-lg mb-1">Why This Information?</h3>
              <p className="text-brand-600 text-sm font-body leading-relaxed">
                Detailed health data allows our AI to provide a more accurate Dosha assessment. 
                All information is encrypted and confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPatientForm;
