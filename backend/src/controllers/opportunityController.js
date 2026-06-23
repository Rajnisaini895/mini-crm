const { validationResult } = require('express-validator');
const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities (shared pipeline)
// @route   GET /api/opportunities
// @access  Protected
const getOpportunities = async (req, res, next) => {
  try {
    const { stage, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};

    if (stage && stage !== 'All') filter.stage = stage;
    if (priority && priority !== 'All') filter.priority = priority;
    if (search) {
      filter.customerName = { $regex: search, $options: 'i' };
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSort = ['createdAt', 'estimatedValue', 'nextFollowUpDate', 'priority'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';

    const opportunities = await Opportunity.find(filter)
      .populate('owner', 'name email')
      .sort({ [sortField]: sortOrder })
      .lean();

    res.status(200).json({
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Protected
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('owner', 'name email');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.status(200).json({ opportunity });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Protected
const createOpportunity = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    // CRITICAL: owner always comes from JWT, never from request body
    const opportunity = await Opportunity.create({
      owner: req.user.id,
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    });

    await opportunity.populate('owner', 'name email');

    res.status(201).json({
      message: 'Opportunity created successfully',
      opportunity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity (owner only)
// @route   PUT /api/opportunities/:id
// @access  Protected + Owner only
const updateOpportunity = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // CRITICAL: backend ownership validation — cannot be bypassed from frontend
    if (opportunity.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: you can only update your own opportunities' });
    }

    const allowedUpdates = [
      'customerName',
      'contactName',
      'contactEmail',
      'contactPhone',
      'requirement',
      'estimatedValue',
      'stage',
      'priority',
      'nextFollowUpDate',
      'notes',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });

    const updated = await opportunity.save();
    await updated.populate('owner', 'name email');

    res.status(200).json({
      message: 'Opportunity updated successfully',
      opportunity: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity (owner only)
// @route   DELETE /api/opportunities/:id
// @access  Protected + Owner only
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // CRITICAL: backend ownership validation — cannot be bypassed from frontend
    if (opportunity.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: you can only delete your own opportunities' });
    }

    await opportunity.deleteOne();

    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
