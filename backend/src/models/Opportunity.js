const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // NEVER set from frontend — always from req.user.id in controller
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [150, 'Customer name cannot exceed 150 characters'],
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact name cannot exceed 100 characters'],
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid contact email'],
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    requirement: {
      type: String,
      required: [true, 'Requirement summary is required'],
      trim: true,
      maxlength: [1000, 'Requirement cannot exceed 1000 characters'],
    },
    estimatedValue: {
      type: Number,
      min: [0, 'Estimated value must be non-negative'],
      default: 0,
    },
    stage: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid stage',
      },
      default: 'New',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    nextFollowUpDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

// Index for faster filtering
opportunitySchema.index({ stage: 1 });
opportunitySchema.index({ priority: 1 });
opportunitySchema.index({ owner: 1 });
opportunitySchema.index({ customerName: 'text' }); // text search

module.exports = mongoose.model('Opportunity', opportunitySchema);
