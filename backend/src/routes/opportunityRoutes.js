const express = require('express');
const { body } = require('express-validator');
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Shared validation rules
const opportunityValidation = [
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ max: 150 }).withMessage('Customer name cannot exceed 150 characters'),
  body('requirement')
    .trim()
    .notEmpty().withMessage('Requirement summary is required')
    .isLength({ max: 1000 }).withMessage('Requirement cannot exceed 1000 characters'),
  body('estimatedValue')
    .optional()
    .isNumeric().withMessage('Estimated value must be a number')
    .custom((v) => v >= 0).withMessage('Estimated value must be non-negative'),
  body('stage')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid stage value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('contactEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid contact email'),
  body('nextFollowUpDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid date format'),
];

// Update validation is same but all fields optional
const updateValidation = [
  body('customerName')
    .optional()
    .trim()
    .notEmpty().withMessage('Customer name cannot be empty')
    .isLength({ max: 150 }).withMessage('Customer name cannot exceed 150 characters'),
  body('requirement')
    .optional()
    .trim()
    .notEmpty().withMessage('Requirement cannot be empty')
    .isLength({ max: 1000 }).withMessage('Requirement cannot exceed 1000 characters'),
  body('estimatedValue')
    .optional()
    .isNumeric().withMessage('Estimated value must be a number')
    .custom((v) => v >= 0).withMessage('Estimated value must be non-negative'),
  body('stage')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid stage value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('contactEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid contact email'),
  body('nextFollowUpDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid date format'),
];

// All routes protected by JWT middleware
router.use(protect);

router.route('/')
  .get(getOpportunities)
  .post(opportunityValidation, createOpportunity);

router.route('/:id')
  .get(getOpportunityById)
  .put(updateValidation, updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;
