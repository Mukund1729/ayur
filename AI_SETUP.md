# AI API Keys Setup Guide

## Overview
AyurTaila AI supports multiple AI providers for enhanced oil drop analysis. You can use one or more of the following services:

## Supported AI Services

### 1. OpenAI GPT-4 Vision (Recommended)
- **Best for**: Detailed analysis with medical context
- **Features**: Vision capabilities, medical knowledge, detailed insights
- **Cost**: ~$0.03 per analysis
- **Setup**:

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to **API Keys** → **Create new secret key**
4. Copy your API key
5. Update `e:\ayur\ai-service\.env`:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 2. Google Gemini Vision
- **Best for**: Fast analysis, good accuracy
- **Features**: Vision capabilities, multilingual support
- **Cost**: Free tier available, then ~$0.0025 per image
- **Setup**:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an account or sign in
3. Click **Get API Key**
4. Copy your API key
5. Update `e:\ayur\ai-service\.env`:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```

### 3. Anthropic Claude Vision
- **Best for**: Medical context, safety-focused
- **Features**: Vision capabilities, strong safety filters
- **Cost**: ~$0.015 per image
- **Setup**:

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to **API Keys**
4. Create a new API key
5. Update `e:\ayur\ai-service\.env`:
   ```
   CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
   ```

## Configuration Steps

### Step 1: Choose Your AI Provider
Select one or more providers based on your needs:
- **OpenAI**: Best quality, higher cost
- **Gemini**: Good balance, lower cost
- **Claude**: Strong safety, moderate cost

### Step 2: Update Environment File
Edit `e:\ayur\ai-service\.env` and replace the placeholder keys:

```env
# Enhanced AI Service Configuration
PORT=8000
DEBUG=false
FLASK_ENV=development

# Choose ONE or MORE of the following:

# OpenAI GPT-4 Vision (Recommended)
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Google Gemini Vision  
GEMINI_API_KEY=your-actual-gemini-key-here

# Anthropic Claude Vision
CLAUDE_API_KEY=sk-ant-your-actual-claude-key-here

# Analysis Configuration
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,bmp
```

### Step 3: Restart Services
1. Stop any running AI service
2. Start the enhanced AI service:
   ```bash
   cd e:\ayur\ai-service
   python enhanced_ai.py
   ```

### Step 4: Verify Setup
1. Check AI service health: http://localhost:8000/health
2. Check configuration: http://localhost:8000/config
3. Test with a sample image

## Usage Priority

The system will try AI providers in this order:
1. **OpenAI** (if key available)
2. **Gemini** (if key available) 
3. **Claude** (if key available)
4. **Traditional** (fallback - no API key needed)

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables only**
- **Keep keys private and secure**
- **Monitor usage and costs**
- **Set up billing alerts**

## Testing Without API Keys

The system works without any API keys using traditional computer vision:
- Pattern recognition algorithms
- Basic dosha prediction
- Confidence scoring
- Standard observations

For enhanced analysis with medical insights, add at least one AI API key.

## Troubleshooting

### Common Issues

**AI Service Not Starting**:
- Check Python dependencies: `pip install -r requirements.txt`
- Verify API key format
- Check port 8000 availability

**API Key Errors**:
- Verify key is correct (no extra spaces)
- Check key permissions
- Ensure billing is set up

**Connection Issues**:
- Check firewall settings
- Verify backend is running on port 5000
- Ensure AI service runs on port 8000

### Getting Help

1. Check AI service logs for error messages
2. Verify API key validity in provider dashboard
3. Test API key with provider's test tools
4. Check network connectivity

## Cost Optimization

- **Start with one provider** to test
- **Monitor usage** in provider dashboards
- **Set usage limits** if available
- **Use traditional analysis** for testing

---

**Ready to start!** Once configured, your AyurTaila AI will provide enhanced medical insights alongside traditional Ayurvedic analysis.
