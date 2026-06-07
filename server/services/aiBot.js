class AIBot {
  constructor() {
    this.name = 'Isis Support Bot';
    this.knowledgeBase = this.initializeKnowledge();
  }

  initializeKnowledge() {
    return {
      'how to generate video': 'To generate a video: 1. Go to Dashboard 2. Click "Create New Video" 3. Choose generation type (Text-to-Video, Image-to-Video) 4. Enter your prompt/image 5. Select AI model and quality 6. Click Generate',
      'what models available': 'We offer: Runway Gen-3 (Best Quality), Luma Dream Machine (Smooth Motion), Stable Video Diffusion (Open-source), and more',
      'credits': 'Free Plan: 150 credits/month. Pro: 1000 credits/month ($19). Enterprise: 10000 credits/month ($149)',
      'billing': 'Billing is managed through PayPal. You can view invoices in Settings > Billing',
      'cancellation': 'You can cancel anytime from Settings > Subscription. No refunds for partial months',
      'resolution': 'Supported resolutions: 720p (Free), 1080p (Pro), 2K (Pro), 4K (Enterprise)',
      'duration': 'Max video duration: Free=10s, Pro=30s, Enterprise=120s',
      'api': 'API access available on Enterprise plan. Contact support for documentation',
      'watermark': 'Watermark-free videos available on Pro and Enterprise plans',
      'batch': 'Batch processing (generate multiple videos) available on Pro and Enterprise',
      'support': 'Email: ma9933151@gmail.com | Phone: +20 201143628812 | Response time: 24-48 hours',
      'default': 'I can help with: generation, credits, billing, models, resolution, support info. What do you need?'
    };
  }

  findAnswer(query) {
    const lowerQuery = query.toLowerCase();
    
    for (const [key, answer] of Object.entries(this.knowledgeBase)) {
      if (lowerQuery.includes(key)) {
        return answer;
      }
    }
    
    return this.knowledgeBase['default'];
  }

  generateResponse(query) {
    const answer = this.findAnswer(query);
    return {
      message: answer,
      timestamp: new Date(),
      confidence: 0.95
    };
  }
}

module.exports = new AIBot();
