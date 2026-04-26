import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
from typing import Dict, List, Tuple
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

class TailaBinduAnalyzer:
    """AI-powered Taila Bindu Pariksha analyzer using computer vision"""
    
    def __init__(self):
        self.dosha_patterns = {
            'vata': {
                'characteristics': ['irregular', 'spiky', 'asymmetric', 'rapid_spread'],
                'color_ranges': [(0, 100, 100), (10, 255, 255)],  # HSV ranges
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
    
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess the image for analysis"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Enhance contrast using CLAHE
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(blurred)
        
        # Apply threshold to create binary image
        _, binary = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return binary
    
    def detect_oil_drop(self, binary_image: np.ndarray) -> Tuple[List[Tuple[int, int, int, int]], np.ndarray]:
        """Detect oil drop regions in the image"""
        # Find contours
        contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter contours based on area
        min_area = 100  # Minimum area threshold
        max_area = binary_image.size * 0.5  # Maximum area threshold
        
        oil_drops = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if min_area < area < max_area:
                # Get bounding box
                x, y, w, h = cv2.boundingRect(contour)
                oil_drops.append((x, y, w, h))
        
        return oil_drops, binary_image
    
    def extract_features(self, image: np.ndarray, oil_drops: List[Tuple[int, int, int, int]]) -> Dict:
        """Extract features from oil drop patterns"""
        features = {
            'area_ratios': [],
            'circularities': [],
            'aspect_ratios': [],
            'spread_patterns': [],
            'edge_descriptors': [],
            'texture_features': []
        }
        
        for (x, y, w, h) in oil_drops:
            # Extract ROI
            roi = image[y:y+h, x:x+w]
            
            # Calculate area ratio
            total_area = image.shape[0] * image.shape[1]
            drop_area = w * h
            features['area_ratios'].append(drop_area / total_area)
            
            # Calculate circularity
            if w > 0 and h > 0:
                circularity = min(w, h) / max(w, h)
                features['circularities'].append(circularity)
                features['aspect_ratios'].append(w / h)
            
            # Analyze spread pattern
            spread_analysis = self.analyze_spread_pattern(roi)
            features['spread_patterns'].append(spread_analysis)
            
            # Extract edge features
            edge_features = self.extract_edge_features(roi)
            features['edge_descriptors'].append(edge_features)
            
            # Extract texture features
            texture_features = self.extract_texture_features(roi)
            features['texture_features'].append(texture_features)
        
        return features
    
    def analyze_spread_pattern(self, roi: np.ndarray) -> Dict:
        """Analyze the spreading pattern of oil drop"""
        # Calculate gradient magnitude
        grad_x = cv2.Sobel(roi, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(roi, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        
        # Calculate spread metrics
        mean_gradient = np.mean(gradient_magnitude)
        std_gradient = np.std(gradient_magnitude)
        
        # Analyze pattern uniformity
        uniformity = 1 - (std_gradient / (mean_gradient + 1e-6))
        
        return {
            'mean_gradient': mean_gradient,
            'std_gradient': std_gradient,
            'uniformity': uniformity,
            'spread_rate': self.calculate_spread_rate(roi)
        }
    
    def calculate_spread_rate(self, roi: np.ndarray) -> float:
        """Calculate the spread rate of oil drop"""
        # Simple heuristic based on intensity distribution
        hist = cv2.calcHist([roi], [0], None, [256], [0, 256])
        hist = hist.flatten()
        
        # Calculate spread as ratio of non-zero pixels
        non_zero_ratio = np.count_nonzero(roi) / roi.size
        
        return non_zero_ratio
    
    def extract_edge_features(self, roi: np.ndarray) -> Dict:
        """Extract edge features from oil drop"""
        # Apply Canny edge detection
        edges = cv2.Canny(roi, 50, 150)
        
        # Calculate edge density
        edge_density = np.count_nonzero(edges) / edges.size
        
        # Find edge contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Calculate edge complexity
        total_edge_length = sum(cv2.arcLength(contour, True) for contour in contours)
        
        return {
            'edge_density': edge_density,
            'edge_count': len(contours),
            'total_edge_length': total_edge_length,
            'edge_complexity': total_edge_length / (roi.shape[0] * roi.shape[1])
        }
    
    def extract_texture_features(self, roi: np.ndarray) -> Dict:
        """Extract texture features from oil drop"""
        # Calculate Local Binary Pattern (simplified)
        # Using gray-level co-occurrence matrix features
        
        # Calculate texture metrics
        mean_intensity = np.mean(roi)
        std_intensity = np.std(roi)
        
        # Calculate contrast
        contrast = std_intensity / (mean_intensity + 1e-6)
        
        # Calculate homogeneity (simplified)
        kernel = np.ones((3, 3), np.float32) / 9
        filtered = cv2.filter2D(roi, -1, kernel)
        homogeneity = 1 - np.std(filtered) / (mean_intensity + 1e-6)
        
        return {
            'mean_intensity': mean_intensity,
            'std_intensity': std_intensity,
            'contrast': contrast,
            'homogeneity': homogeneity
        }
    
    def classify_dosha(self, features: Dict) -> Tuple[str, float, List[str]]:
        """Classify the dominant Dosha based on extracted features"""
        scores = {'vata': 0, 'pitta': 0, 'kapha': 0}
        observations = []
        
        # Analyze circularities
        if features['circularities']:
            avg_circularity = np.mean(features['circularities'])
            if avg_circularity < 0.4:
                scores['vata'] += 3
                observations.append("Irregular, spiky patterns observed - typical of Vata")
            elif avg_circularity < 0.7:
                scores['pitta'] += 3
                observations.append("Moderately circular patterns - typical of Pitta")
            else:
                scores['kapha'] += 3
                observations.append("Well-rounded, smooth patterns - typical of Kapha")
        
        # Analyze spread patterns
        if features['spread_patterns']:
            avg_spread_rate = np.mean([p['spread_rate'] for p in features['spread_patterns']])
            if avg_spread_rate > 0.7:
                scores['vata'] += 2
                observations.append("Rapid spreading pattern - Vata characteristic")
            elif avg_spread_rate > 0.4:
                scores['pitta'] += 2
                observations.append("Moderate spreading - Pitta characteristic")
            else:
                scores['kapha'] += 2
                observations.append("Slow, dense spreading - Kapha characteristic")
        
        # Analyze edge features
        if features['edge_descriptors']:
            avg_edge_complexity = np.mean([e['edge_complexity'] for e in features['edge_descriptors']])
            if avg_edge_complexity > 0.6:
                scores['vata'] += 1
                observations.append("Complex, irregular edges - Vata tendency")
            elif avg_edge_complexity > 0.3:
                scores['pitta'] += 1
                observations.append("Moderately defined edges - Pitta tendency")
            else:
                scores['kapha'] += 1
                observations.append("Smooth, uniform edges - Kapha tendency")
        
        # Analyze texture features
        if features['texture_features']:
            avg_contrast = np.mean([t['contrast'] for t in features['texture_features']])
            if avg_contrast > 0.8:
                scores['vata'] += 1
                observations.append("High contrast texture - Vata tendency")
            elif avg_contrast > 0.4:
                scores['pitta'] += 1
                observations.append("Moderate texture contrast - Pitta tendency")
            else:
                scores['kapha'] += 1
                observations.append("Smooth, uniform texture - Kapha tendency")
        
        # Determine dominant Dosha
        dominant_dosha = max(scores, key=scores.get)
        confidence = (scores[dominant_dosha] / sum(scores.values())) * 100 if sum(scores.values()) > 0 else 0
        
        return dominant_dosha, confidence, observations
    
    def analyze_image(self, image_data: bytes) -> Dict:
        """Main analysis function"""
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                raise ValueError("Invalid image format")
            
            # Preprocess image
            binary_image = self.preprocess_image(image)
            
            # Detect oil drops
            oil_drops, _ = self.detect_oil_drop(binary_image)
            
            if not oil_drops:
                return {
                    'success': False,
                    'error': 'No oil drop detected in the image',
                    'doshaPrediction': None,
                    'confidence': 0,
                    'observations': ['Unable to detect oil drop patterns. Please ensure the image shows a clear oil drop on urine sample.']
                }
            
            # Extract features
            features = self.extract_features(binary_image, oil_drops)
            
            # Classify Dosha
            dosha_prediction, confidence, observations = self.classify_dosha(features)
            
            # Add additional observations
            observations.extend([
                f"Detected {len(oil_drops)} oil drop region(s)",
                f"Average circularity: {np.mean(features['circularities']):.2f}" if features['circularities'] else "Circularity analysis unavailable",
                f"Average spread rate: {np.mean([p['spread_rate'] for p in features['spread_patterns']]):.2f}" if features['spread_patterns'] else "Spread analysis unavailable"
            ])
            
            return {
                'success': True,
                'doshaPrediction': dosha_prediction,
                'confidence': round(confidence, 2),
                'observations': observations,
                'features': features
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'doshaPrediction': None,
                'confidence': 0,
                'observations': [f'Analysis error: {str(e)}']
            }

# Initialize analyzer
analyzer = TailaBinduAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AyurTaila AI Analysis Service',
        'version': '1.0.0'
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
        
        # Handle base64 encoded image
        if data['image'].startswith('data:image'):
            # Remove data URL prefix
            base64_data = data['image'].split(',')[1]
            image_data = base64.b64decode(base64_data)
        else:
            # Handle direct base64
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
        import requests
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"Starting AyurTaila AI Analysis Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
