
import express from 'express';
import { 
  createLink,
  redirectToOriginalUrl, 
  getLinkAnalytics, 
  getUserLinks,
  generateQRCode
} from '../controllers/linkController';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/links
// @desc    Create a new shortened URL
// @access  Private
router.post('/', protect, createLink);

// @route   GET /api/links
// @desc    Get all links for a user
// @access  Private
router.get('/', protect, getUserLinks);

// @route   GET /api/links/:linkId/analytics
// @desc    Get analytics for a specific link
// @access  Private
router.get('/:linkId/analytics', protect, getLinkAnalytics);

// @route   GET /api/links/:shortUrl/qr
// @desc    Generate QR code for a short URL
// @access  Private
router.get('/:shortUrl/qr', protect, generateQRCode);

// @route   GET /api/links/:shortUrl
// @desc    Redirect to original URL
// @access  Public
router.get('/:shortUrl', redirectToOriginalUrl);

export default router;
