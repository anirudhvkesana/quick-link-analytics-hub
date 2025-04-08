
import { Request, Response } from 'express';
import Link, { ILink } from '../models/Link';
import shortid from 'shortid';
import QRCode from 'qrcode';
import { isValidUrl } from '../utils/validation';

// Create a new shortened link
export const createLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { originalUrl, customAlias, expirationDate } = req.body;
    const userId = (req as any).user.id;

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      res.status(400).json({ success: false, message: 'Invalid URL format' });
      return;
    }

    // Generate or use custom short URL
    let shortUrl = customAlias || shortid.generate();

    // Check if custom alias is already in use
    if (customAlias) {
      const existingLink = await Link.findOne({ shortUrl: customAlias });
      if (existingLink) {
        res.status(400).json({ 
          success: false, 
          message: 'Custom alias already in use' 
        });
        return;
      }
    }

    // Create new link
    const link = new Link({
      originalUrl,
      shortUrl,
      userId,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      clickEvents: []
    });

    await link.save();

    res.status(201).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        clicks: link.clicks,
        createdAt: link.createdAt,
        expirationDate: link.expirationDate
      }
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Redirect from short URL to original URL
export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    
    const link = await Link.findOne({ shortUrl });

    if (!link) {
      res.status(404).json({ success: false, message: 'URL not found' });
      return;
    }

    // Check if link has expired
    if (link.expirationDate && new Date() > link.expirationDate) {
      res.status(410).json({ success: false, message: 'Link has expired' });
      return;
    }

    // Record click event
    const clickEvent = {
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || req.headers.referrer,
      location: req.headers['x-forwarded-for'] || req.ip
    };

    link.clickEvents.push(clickEvent);
    link.clicks += 1;
    await link.save();

    // Redirect to original URL
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get analytics for a specific link
export const getLinkAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { linkId } = req.params;
    const userId = (req as any).user.id;

    const link = await Link.findOne({ _id: linkId, userId });

    if (!link) {
      res.status(404).json({ success: false, message: 'Link not found' });
      return;
    }

    // Calculate basic analytics
    const analytics = {
      totalClicks: link.clicks,
      isExpired: link.expirationDate ? new Date() > link.expirationDate : false,
      clicksByDate: {} as Record<string, number>,
      devices: {} as Record<string, number>,
      browsers: {} as Record<string, number>,
      referrers: {} as Record<string, number>
    };

    // Process click events
    link.clickEvents.forEach(event => {
      // Group by date
      const date = event.timestamp.toISOString().split('T')[0];
      analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;

      // Extract device and browser info
      if (event.userAgent) {
        const userAgent = event.userAgent.toLowerCase();
        
        // Simple device detection
        if (userAgent.includes('mobile')) {
          analytics.devices['mobile'] = (analytics.devices['mobile'] || 0) + 1;
        } else if (userAgent.includes('tablet')) {
          analytics.devices['tablet'] = (analytics.devices['tablet'] || 0) + 1;
        } else {
          analytics.devices['desktop'] = (analytics.devices['desktop'] || 0) + 1;
        }

        // Simple browser detection
        if (userAgent.includes('chrome')) {
          analytics.browsers['chrome'] = (analytics.browsers['chrome'] || 0) + 1;
        } else if (userAgent.includes('firefox')) {
          analytics.browsers['firefox'] = (analytics.browsers['firefox'] || 0) + 1;
        } else if (userAgent.includes('safari')) {
          analytics.browsers['safari'] = (analytics.browsers['safari'] || 0) + 1;
        } else if (userAgent.includes('edge')) {
          analytics.browsers['edge'] = (analytics.browsers['edge'] || 0) + 1;
        } else {
          analytics.browsers['other'] = (analytics.browsers['other'] || 0) + 1;
        }
      }

      // Track referrers
      if (event.referrer) {
        const referrer = new URL(event.referrer).hostname;
        analytics.referrers[referrer] = (analytics.referrers[referrer] || 0) + 1;
      } else {
        analytics.referrers['direct'] = (analytics.referrers['direct'] || 0) + 1;
      }
    });

    res.json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        createdAt: link.createdAt,
        expirationDate: link.expirationDate,
        isExpired: analytics.isExpired
      },
      analytics
    });
  } catch (error) {
    console.error('Get link analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all links for a user with pagination and search
export const getUserLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    
    const skip = (page - 1) * limit;

    // Build query
    let query: any = { userId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortUrl: { $regex: search, $options: 'i' } }
      ];
    }

    // Get links with pagination
    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Link.countDocuments(query);

    // Process links to include expiration status
    const processedLinks = links.map(link => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      clicks: link.clicks,
      createdAt: link.createdAt,
      expirationDate: link.expirationDate,
      isExpired: link.expirationDate ? new Date() > link.expirationDate : false
    }));

    res.json({
      success: true,
      links: processedLinks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user links error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Generate QR code for a link
export const generateQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    const baseUrl = process.env.BASE_URL || `http://${req.headers.host}`;
    const fullUrl = `${baseUrl}/api/links/${shortUrl}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(fullUrl);

    res.json({
      success: true,
      qrCode
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
