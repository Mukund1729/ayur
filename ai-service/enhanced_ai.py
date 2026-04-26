import os
import cv2
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64
from io import BytesIO
from PIL import Image
import requests
from dotenv import load_dotenv
import logging
import json
from datetime import datetime
import re
import time
from typing import Dict, Any, Optional, List

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# AI Service Configuration
PORT = int(os.getenv('PORT', 8000))
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
FLASK_ENV = os.getenv('FLASK_ENV', 'development')

# API Keys
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')

# Analysis Configuration
MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 10485760))  # 10MB
ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'jpg,jpeg,png,bmp').split(','))

# AI Provider Priority
AI_PROVIDERS = []
if OPENAI_API_KEY and OPENAI_API_KEY != 'your_openai_api_key_here':
    AI_PROVIDERS.append('openai')
if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here':
    AI_PROVIDERS.append('gemini')
if CLAUDE_API_KEY and CLAUDE_API_KEY != 'your_claude_api_key_here':
    AI_PROVIDERS.append('claude')

logger.info(f"Available AI providers: {AI_PROVIDERS}")

class EnhancedTailaAnalyzer:
    """Enhanced AI analyzer with external API support"""
    
    def __init__(self):
        self.ai_providers = AI_PROVIDERS
        
        # Traditional pattern analysis
        self.dosha_patterns = {
            'vata': {
                'characteristics': ['irregular', 'spiky', 'asymmetric', 'rapid_spread'],
                'color_ranges': [(0, 100, 100), (10, 255, 255)],
                'shape_metrics': {'circularity': 0.3, 'aspect_ratio': 1.5}
            },
            'pitta': {
                'characteristics': ['circular', 'uniform', 'moderate_spread', 'sharp_edges'],
                'color_ranges': [(10, 100, 100), (25, 255, 255)],
                'shape_metrics': {'circularity': 0.7, 'aspect_ratio': 1.2}
            },
            'kapha': {
                'characteristics': ['dense', 'slow_spread', 'rounded', 'smooth_edges'],
                'color_ranges': [(25, 100, 100), (35, 255, 255)],
                'shape_metrics': {'circularity': 0.8, 'aspect_ratio': 1.1}
            }
        }
    
    def _analyze_with_openai(self, image_base64: str, dosha_prediction: str, confidence: float) -> Dict[str, Any]:
        """Analyze with OpenAI GPT-4 Vision"""
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        prompt = f"""
        Analyze this oil drop (Taila Bindu Pariksha) image for Ayurvedic dosha analysis.
        
        Traditional analysis suggests: {dosha_prediction} dosha with {confidence}% confidence.
        
        Please provide detailed analysis in JSON format:
        {{
            "dosha_assessment": "your confirmed dosha type",
            "confidence_score": "your confidence percentage",
            "key_observations": ["observation1", "observation2", "observation3"],
            "health_implications": ["implication1", "implication2"],
            "specific_recommendations": ["recommendation1", "recommendation2", "recommendation3"],
            "visual_characteristics": {{
                "spread_pattern": "description",
                "color_analysis": "description",
                "density_assessment": "description",
                "movement_pattern": "description"
            }}
        }}
        
        Focus on visual patterns: spread, color, density, movement characteristics.
        """
        
        data = {
            'model': 'gpt-4-vision-preview',
            'messages': [
                {
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': prompt},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{image_base64}'}}
                    ]
                }
            ],
            'max_tokens': 800
        }
        
        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        analysis_text = result['choices'][0]['message']['content']
        
        # Try to parse JSON response
        try:
            json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
            if json_match:
                parsed_data = json.loads(json_match.group())
                return {
                    'provider': 'openai',
                    'analysis': analysis_text,
                    'structured_data': parsed_data,
                    'confidence_adjustment': self._adjust_confidence(analysis_text, confidence),
                    'insights': self._extract_insights(analysis_text)
                }
        except:
            pass
        
        return {
            'provider': 'openai',
            'analysis': analysis_text,
            'confidence_adjustment': self._adjust_confidence(analysis_text, confidence),
            'insights': self._extract_insights(analysis_text)
        }
    
    def _analyze_with_gemini(self, image_base64: str, dosha_prediction: str, confidence: float) -> Dict[str, Any]:
        """Analyze with Google Gemini Vision"""
        headers = {
            'Content-Type': 'application/json'
        }
        
        prompt = f"""
        Analyze this oil drop image for Ayurvedic dosha analysis (Taila Bindu Pariksha).
        
        Traditional analysis: {dosha_prediction} dosha ({confidence}% confidence).
        
        Provide detailed analysis in this format:
        DOSHA_ASSESSMENT: [your assessment]
        CONFIDENCE_SCORE: [your confidence %]
        KEY_OBSERVATIONS: [observation1, observation2, observation3]
        HEALTH_IMPLICATIONS: [implication1, implication2]
        SPECIFIC_RECOMMENDATIONS: [recommendation1, recommendation2, recommendation3]
        VISUAL_CHARACTERISTICS:
        - SPREAD_PATTERN: [description]
        - COLOR_ANALYSIS: [description]
        - DENSITY_ASSESSMENT: [description]
        - MOVEMENT_PATTERN: [description]
        
        Focus on visual characteristics of the oil pattern.
        """
        
        data = {
            'contents': [
                {
                    'parts': [
                        {'text': prompt},
                        {
                            'inline_data': {
                                'mime_type': 'image/jpeg',
                                'data': image_base64
                            }
                        }
                    ]
                }
            ]
        }
        
        response = requests.post(f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={GEMINI_API_KEY}', 
                              headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        analysis_text = result['candidates'][0]['content']['parts'][0]['text']
        
        # Parse structured response
        structured_data = self._parse_gemini_response(analysis_text)
        
        return {
            'provider': 'gemini',
            'analysis': analysis_text,
            'structured_data': structured_data,
            'confidence_adjustment': self._adjust_confidence(analysis_text, confidence),
            'insights': self._extract_insights(analysis_text)
        }
    
    def _parse_gemini_response(self, text: str) -> Dict[str, Any]:
        """Parse Gemini response into structured data"""
        data = {}
        patterns = {
            'DOSHA_ASSESSMENT': r'DOSHA_ASSESSMENT:\s*(.+?)(?=\n|$)',
            'CONFIDENCE_SCORE': r'CONFIDENCE_SCORE:\s*(.+?)(?=\n|$)',
            'KEY_OBSERVATIONS': r'KEY_OBSERVATIONS:\s*(.+?)(?=\n[A-Z_]+:|$)',
            'HEALTH_IMPLICATIONS': r'HEALTH_IMPLICATIONS:\s*(.+?)(?=\n[A-Z_]+:|$)',
            'SPECIFIC_RECOMMENDATIONS': r'SPECIFIC_RECOMMENDATIONS:\s*(.+?)(?=\n[A-Z_]+:|$)'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, text, re.DOTALL)
            if match:
                value = match.group(1).strip()
                if 'OBSERVATIONS' in key or 'IMPLICATIONS' in key or 'RECOMMENDATIONS' in key:
                    data[key.lower()] = [item.strip() for item in value.split(',') if item.strip()]
                else:
                    data[key.lower()] = value
        
        return data
    
    def _adjust_confidence(self, analysis_text: str, confidence: float) -> float:
        """Adjust confidence based on AI analysis"""
        # TO DO: implement confidence adjustment logic
        return confidence
    
    def _extract_insights(self, analysis_text: str) -> List[str]:
        """Extract insights from AI analysis"""
        # TO DO: implement insight extraction logic
        return []
    
    def analyze_with_ai(self, image_base64: str, dosha_prediction: str, confidence: float) -> Dict[str, Any]:
        """Enhanced analysis using AI providers with fallback"""
        ai_result = None
        provider_used = None
        errors = []
        
        # Try each available provider in priority order
        for provider in self.ai_providers:
            try:
                if provider == 'openai':
                    ai_result = self._analyze_with_openai(image_base64, dosha_prediction, confidence)
                elif provider == 'gemini':
                    ai_result = self._analyze_with_gemini(image_base64, dosha_prediction, confidence)
                elif provider == 'claude':
                    ai_result = self._analyze_with_claude(image_base64, dosha_prediction, confidence)
                
                if ai_result:
                    provider_used = provider
                    logger.info(f"Successfully analyzed with {provider}")
                    break
                    
            except Exception as e:
                error_msg = f"{provider} analysis failed: {str(e)}"
                logger.warning(error_msg)
                errors.append(error_msg)
                continue
        
        return {
            'ai_analysis': ai_result,
            'provider_used': provider_used,
            'analysis_method': f'AI Enhanced ({provider_used.title()})' if provider_used else 'Traditional',
            'errors': errors,
            'available_providers': self.ai_providers
        }
    
    def traditional_analysis(self, image: np.ndarray) -> Dict:
        """Traditional computer vision analysis"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Find contours
        _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return {
                'dosha_prediction': 'kapha',
                'confidence': 60,
                'observations': ['No clear pattern detected'],
                'insights': ['Analysis inconclusive'],
                'recommendations': ['Please retake the image']
            }
        
        # Analyze largest contour
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Calculate features
        area = cv2.contourArea(largest_contour)
        perimeter = cv2.arcLength(largest_contour, True)
        
        if perimeter > 0:
            circularity = 4 * np.pi * area / (perimeter ** 2)
        else:
            circularity = 0
            
        # Get bounding box
        x, y, w, h = cv2.boundingRect(largest_contour)
        aspect_ratio = w / h if h > 0 else 1
        
        # Determine dosha based on features
        if circularity > 0.7:
            dosha = 'kapha'
            confidence = min(80, circularity * 100)
            observations = ['Circular pattern detected', 'Smooth edges', 'Dense appearance']
        elif circularity > 0.4:
            dosha = 'pitta'
            confidence = min(75, circularity * 100)
            observations = ['Moderately circular', 'Uniform spread', 'Sharp edges']
        else:
            dosha = 'vata'
            confidence = min(70, (1 - circularity) * 100)
            observations = ['Irregular pattern', 'Asymmetric shape', 'Spiky edges']
        
        return {
            'dosha_prediction': dosha,
            'confidence': round(confidence, 1),
            'observations': observations,
            'insights': [f'Pattern indicates {dosha} dosha dominance'],
            'recommendations': [f'Balance {dosha} dosha with appropriate diet and lifestyle']
        }
    
    def analyze_image(self, image_data: bytes) -> Dict:
        """Main analysis function with AI enhancement"""
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {
                    'success': False,
                    'error': 'Invalid image data'
                }
            
            # Traditional analysis
            traditional_result = self.traditional_analysis(image)
            
            # Convert image to base64 for AI APIs
            _, buffer = cv2.imencode('.jpg', image)
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Try AI enhancement
            ai_result = self.analyze_with_ai(image_base64, traditional_result['dosha_prediction'], traditional_result['confidence'])
            
            # Use AI result if available, otherwise use traditional
            final_result = ai_result['ai_analysis'] if ai_result['ai_analysis'] else traditional_result
            
            return {
                'success': True,
                'data': final_result,
                'analysis_method': ai_result['analysis_method'],
                'traditional_result': traditional_result,
                'provider_used': ai_result['provider_used'],
                'errors': ai_result['errors']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Analysis failed: {str(e)}'
            }

# Initialize analyzer
analyzer = EnhancedTailaAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AyurTaila Enhanced AI Analysis',
        'version': '2.0.0',
        'ai_apis': {
            'openai': bool(analyzer.openai_api_key),
            'gemini': bool(analyzer.gemini_api_key),
            'claude': bool(analyzer.claude_api_key)
        }
    })

@app.route('/analyze', methods=['POST'])
def analyze_image():
    """Analyze oil drop image for Dosha prediction"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image data provided'
            }), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        
        # Perform analysis
        result = analyzer.analyze_image(image_data)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/analyze-url', methods=['POST'])
def analyze_image_url():
    """Analyze image from URL"""
    try:
        data = request.get_json()
        
        if not data or 'imageUrl' not in data:
            return jsonify({
                'success': False,
                'error': 'No image URL provided'
            }), 400
        
        # Download image from URL
        response = requests.get(data['imageUrl'])
        image_data = response.content
        
        # Perform analysis
        result = analyzer.analyze_image(image_data)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/config', methods=['GET'])
def get_config():
    """Get current AI configuration"""
    return jsonify({
        'available_apis': {
            'openai': bool(analyzer.openai_api_key),
            'gemini': bool(analyzer.gemini_api_key),
            'claude': bool(analyzer.claude_api_key)
        },
        'recommended_api': 'OpenAI GPT-4 Vision for best results'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"Starting Enhanced AyurTaila AI Analysis Service on port {port}")
    if OPENAI_API_KEY and OPENAI_API_KEY != 'your_openai_api_key_here':
        print("✅ OpenAI API configured")
    if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here':
        print("✅ Gemini API configured")
    if CLAUDE_API_KEY and CLAUDE_API_KEY != 'your_claude_api_key_here':
        print("✅ Claude API configured")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
