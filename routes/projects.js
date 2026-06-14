const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, desc, category, tech, color, github, live, developer, order } = req.body;

    const projectData = {
      title,
      desc,
      category,
      tech: tech ? JSON.parse(tech) : [],
      color: color || '#00f0ff',
      github: github || '#',
      live: live || '#',
      developer,
      order: order || 0,
    };

    if (req.files && req.files.image) {
      projectData.image = req.files.image[0].path;
    }
    if (req.files && req.files.video) {
      projectData.video = req.files.video[0].path;
    }

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, desc, category, tech, color, github, live, developer, order } = req.body;

    project.title = title || project.title;
    project.desc = desc || project.desc;
    project.category = category || project.category;
    project.tech = tech ? JSON.parse(tech) : project.tech;
    project.color = color || project.color;
    project.github = github || project.github;
    project.live = live || project.live;
    project.developer = developer || project.developer;
    project.order = order !== undefined ? order : project.order;

    if (req.files && req.files.image) {
      if (project.image) {
        const publicId = project.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(	echbros/, { resource_type: 'image' }).catch(() => {});
      }
      project.image = req.files.image[0].path;
    }
    if (req.files && req.files.video) {
      if (project.video) {
        const publicId = project.video.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(	echbros/, { resource_type: 'video' }).catch(() => {});
      }
      project.video = req.files.video[0].path;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.image) {
      const publicId = project.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(	echbros/, { resource_type: 'image' }).catch(() => {});
    }
    if (project.video) {
      const publicId = project.video.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(	echbros/, { resource_type: 'video' }).catch(() => {});
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
