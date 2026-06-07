const axios = require('axios');
const fetch = require('node-fetch');
const FormData = require('form-data');

class VideoGeneratorService {
  async generateWithRunway(prompt, settings) {
    try {
      console.log('🎬 Generating with Runway ML...');
      
      const response = await axios.post(
        `${process.env.RUNWAY_API_URL}/image_to_video`,
        {
          model: 'gen3',
          prompt,
          seconds: settings.duration || 4,
          seed: settings.seed
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        provider: 'runway',
        taskId: response.data.task_id,
        videoUrl: response.data.video_url,
        estimatedTime: response.data.estimated_time || 30
      };
    } catch (err) {
      console.error('Runway error:', err.response?.data || err.message);
      throw new Error(`Runway ML Error: ${err.message}`);
    }
  }

  async generateWithLuma(prompt, settings) {
    try {
      console.log('🎨 Generating with Luma AI...');
      
      const response = await axios.post(
        `${process.env.LUMA_API_URL}/generations`,
        {
          prompt,
          loop: false,
          aspect_ratio: '16:9',
          model: 'photorealistic'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        provider: 'luma',
        generationId: response.data.id,
        videoUrl: response.data.download_url,
        status: response.data.state
      };
    } catch (err) {
      console.error('Luma error:', err.response?.data || err.message);
      throw new Error(`Luma AI Error: ${err.message}`);
    }
  }

  async generateWithStableVideo(imageUrl, settings) {
    try {
      console.log('🎥 Generating with Stable Video Diffusion...');

      const form = new FormData();
      form.append('image_url', imageUrl);
      form.append('motion_bucket_id', settings.motion || 127);
      form.append('frames_per_second', settings.fps || 24);

      const response = await fetch(
        `${process.env.STABLE_VIDEO_URL}/image-to-video`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.STABLE_VIDEO_API_KEY}`
          },
          body: form
        }
      );

      const data = await response.json();
      return {
        provider: 'stable-video',
        videoUrl: data.video.url,
        format: data.video.format
      };
    } catch (err) {
      console.error('Stable Video error:', err);
      throw new Error(`Stable Video Error: ${err.message}`);
    }
  }
}

module.exports = new VideoGeneratorService();
