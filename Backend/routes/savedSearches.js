const express = require('express');
const SavedSearch = require('../models/SavedSearch');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/saved-searches
// @desc    Save a new search
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { searchName, searchParams, searchResults } = req.body;
    
    const savedSearch = await SavedSearch.create({
      userId: req.user._id,
      searchName,
      searchParams,
      searchResults
    });
    
    res.status(201).json(savedSearch);
  } catch (error) {
    console.error('Error saving search:', error);
    res.status(500).json({ error: 'Server error while saving search' });
  }
});

// @route   GET /api/saved-searches
// @desc    Get all saved searches for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const savedSearches = await SavedSearch.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(savedSearches);
  } catch (error) {
    console.error('Error retrieving saved searches:', error);
    res.status(500).json({ error: 'Server error while retrieving saved searches' });
  }
});

// @route   GET /api/saved-searches/:id
// @desc    Get a specific saved search
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    // Update lastAccessed time
    savedSearch.lastAccessed = Date.now();
    await savedSearch.save();
    
    res.json(savedSearch);
  } catch (error) {
    console.error('Error retrieving saved search:', error);
    res.status(500).json({ error: 'Server error while retrieving saved search' });
  }
});

// @route   PUT /api/saved-searches/:id
// @desc    Update a saved search
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { searchName } = req.body;
    
    const savedSearch = await SavedSearch.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!savedSearch) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    // Only allow updating the search name
    if (searchName) savedSearch.searchName = searchName;
    
    const updatedSearch = await savedSearch.save();
    
    res.json(updatedSearch);
  } catch (error) {
    console.error('Error updating saved search:', error);
    res.status(500).json({ error: 'Server error while updating saved search' });
  }
});

// @route   DELETE /api/saved-searches/:id
// @desc    Delete a saved search
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await SavedSearch.deleteOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    res.json({ message: 'Saved search removed' });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    res.status(500).json({ error: 'Server error while deleting saved search' });
  }
});

module.exports = router;