import React, { useState } from 'react';

interface ConsentPageProps {
  onConsent: (accepted: boolean) => void;
}

const ConsentPage: React.FC<ConsentPageProps> = ({ onConsent }) => {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accepted) {
      setError('You must accept the consent terms to proceed');
      return;
    }
    
    onConsent(true);
  };

  const handleDecline = () => {
    onConsent(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full animate-fade-in-up">
        {/* Header */}
        <div className="bg-brand-900 px-8 py-10 rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-accent-400 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Ayurvedic Diagnostics</p>
            <h1 className="text-4xl md:text-5xl font-display text-cream-100 mb-3">
              Informed Consent
            </h1>
            <p className="text-cream-400/80 font-body text-sm max-w-lg mx-auto">
              Please review the terms below to proceed with your Taila Bindu Pariksha analysis
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-soft-lg px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Introduction */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-display text-brand-900 mb-4 gold-underline inline-block">Introduction</h2>
              <p className="text-brand-600 leading-[1.8] font-body text-[15px]">
                Welcome to AyurTaila AI — where centuries of Ayurvedic wisdom meets modern intelligence. 
                Our platform analyzes the ancient diagnostic technique of <em className="text-accent-600">Taila Bindu Pariksha</em> 
                (oil drop analysis) using advanced computer vision. This consent form outlines how your information 
                is handled and your rights as a valued participant.
              </p>
            </section>

            {/* Purpose */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-2xl font-display text-brand-900 mb-4 gold-underline inline-block">Purpose</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Analyze oil drop patterns for constitutional profiling',
                  'Determine your dominant Dosha (Vata, Pitta, or Kapha)',
                  'Deliver personalized Ayurvedic wellness guidance',
                  'Advance research in AI-assisted traditional medicine'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl border border-cream-200">
                    <div className="w-6 h-6 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div>
                    </div>
                    <p className="text-brand-700 text-sm font-body">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Collection */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-display text-brand-900 mb-4 gold-underline inline-block">Data Collection</h2>
              <p className="text-brand-600 text-sm mb-4 font-body">We collect only what is essential for an accurate assessment:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { label: 'Personal', desc: 'Name, age, gender, contact' },
                  { label: 'Medical', desc: 'Conditions, medications, allergies' },
                  { label: 'Lifestyle', desc: 'Diet, exercise, sleep, stress' },
                  { label: 'Visual', desc: 'Oil drop test images' },
                  { label: 'Symptoms', desc: 'Current health concerns' },
                  { label: 'Results', desc: 'AI-generated predictions' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-brand-50/50 rounded-lg">
                    <span className="text-accent-600 font-display font-semibold text-sm">{item.label}</span>
                    <span className="text-brand-500 text-xs font-body">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy & Security */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <h2 className="text-2xl font-display text-brand-900 mb-4 gold-underline inline-block">Privacy & Security</h2>
              <p className="text-brand-600 leading-[1.8] font-body text-[15px]">
                Your health data is encrypted at rest and in transit. We anonymize information for research, 
                and never share identifiable data with third parties without your explicit, informed consent.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-accent-50 border border-accent-200/60 rounded-xl p-6">
                <h2 className="text-xl font-display text-accent-800 mb-3">Important Disclaimer</h2>
                <p className="text-accent-700/80 leading-[1.8] text-sm font-body">
                  <strong className="text-accent-900">This system is for informational and wellness purposes only.</strong>{' '}
                  It should NOT replace professional medical advice, diagnosis, or treatment. Always consult 
                  qualified healthcare providers for medical concerns. AI predictions are based on Ayurvedic 
                  principles and may not correspond to conventional medical diagnoses.
                </p>
              </div>
            </section>

            {/* Rights */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <h2 className="text-2xl font-display text-brand-900 mb-4 gold-underline inline-block">Your Rights</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  'Withdraw consent anytime',
                  'Request data deletion',
                  'Refuse any question',
                  'Access your results',
                  'Know how data is used'
                ].map((right, i) => (
                  <span key={i} className="px-4 py-2 bg-cream-100 text-brand-700 text-sm rounded-full border border-cream-300 font-body">
                    {right}
                  </span>
                ))}
              </div>
            </section>

            {/* Consent Checkbox */}
            <section className="border-t border-cream-300 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-start gap-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      if (e.target.checked) setError('');
                    }}
                    className="peer w-5 h-5 border-2 border-cream-600 rounded-md checked:bg-accent-500 checked:border-accent-500 appearance-none cursor-pointer transition-all"
                  />
                  <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <label htmlFor="consent-checkbox" className="text-sm text-brand-700 leading-relaxed font-body cursor-pointer">
                  <strong className="text-brand-900">I have read, understood, and agree to the terms outlined above.</strong>{' '}
                  I understand this is an Ayurvedic wellness assessment tool and consent to participate. 
                  I acknowledge results are informational only and do not replace professional medical advice. 
                  I am at least 18 years of age.
                </label>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-3 ml-9 font-body">{error}</p>
              )}
            </section>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
              <button
                type="button"
                onClick={handleDecline}
                className="btn-outline"
              >
                Decline
              </button>
              <button
                type="submit"
                disabled={!accepted}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-soft"
              >
                Accept & Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsentPage;
