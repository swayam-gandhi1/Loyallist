const express = require('express');
const router = express.Router();
const News = require('../models/News');

// CREATE news
router.post('/', async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json({ message: 'News created successfully', news });
  } catch (err) {
    res.status(500).json({ message: 'Error creating news', error: err });
  }
});

// READ all news (latest first)
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching news', error: err });
  }
});

// UPDATE news by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News updated successfully', news: updatedNews });
  } catch (err) {
    res.status(500).json({ message: 'Error updating news', error: err });
  }
});

// DELETE news by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting news', error: err });
  }
});

module.exports = router;
