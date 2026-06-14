const express = require('express');
const router = express.Router();
const AIVideo = require('../models/AIVideo');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const videos = await AIVideo.find({}).sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await AIVideo.findById(req.params.id);
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, prompt, order } = req.body;

    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    const videoData = {
      title,
      prompt: prompt || '',
      video: req.files.video[0].path,
      order: order || 0,
    };

    if (req.files && req.files.thumbnail) {
      videoData.thumbnail = req.files.thumbnail[0].path;
    }

    const video = await AIVideo.create(videoData);
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const video = await AIVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const { title, prompt, order } = req.body;

    video.title = title || video.title;
    video.prompt = prompt !== undefined ? prompt : video.prompt;
    video.order = order !== undefined ? order : video.order;

    if (req.files && req.files.video) {
      if (video.video) {
        const publicId = video.video.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(	echbros/, { resource_type: 'video' }).catch(() => {});
      }
      video.video = req.files.video[0].path;
    }
    if (req.files && req.files.thumbnail) {
      if (video.thumbnail) {
        const publicId = video.thumbnail.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(	echbros/, { resource_type: 'image' }).catch(() => {});
      }
      video.thumbnail = req.files.thumbnail[0].path;
    }

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await AIVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.video) {
      const publicId = video.video.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(	echbros/, { resource_type: 'video' }).catch(() => {});
    }
    if (video.thumbnail) {
      const publicId = video.thumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(	echbros/, { resource_type: 'image' }).catch(() => {});
    }

    await AIVideo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
