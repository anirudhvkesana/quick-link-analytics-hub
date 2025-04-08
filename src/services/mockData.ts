
// Mock data for the Link Analytics Dashboard

import { format, subDays } from 'date-fns';

export type LinkData = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  alias: string;
  createdAt: string;
  expirationDate: string | null;
  clickCount: number;
  isActive: boolean;
};

export type ClickData = {
  date: string;
  count: number;
};

export type DeviceData = {
  device: string;
  count: number;
  percentage: number;
};

export type BrowserData = {
  browser: string;
  count: number;
  percentage: number;
};

export type LocationData = {
  country: string;
  count: number;
  percentage: number;
};

export type LinkDetailsData = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  alias: string;
  createdAt: string;
  expirationDate: string | null;
  clickCount: number;
  isActive: boolean;
  clicksByDate: ClickData[];
  deviceData: DeviceData[];
  browserData: BrowserData[];
  locationData: LocationData[];
};

// Generate mock links
export const mockLinks: LinkData[] = [
  {
    id: '1',
    originalUrl: 'https://example.com/very-long-article-about-web-development-trends-in-2025',
    shortUrl: 'https://qlink.io/abc123',
    alias: 'abc123',
    createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    expirationDate: format(subDays(new Date(), -30), 'yyyy-MM-dd'),
    clickCount: 1245,
    isActive: true,
  },
  {
    id: '2',
    originalUrl: 'https://example.com/how-to-improve-seo-for-your-website-comprehensive-guide',
    shortUrl: 'https://qlink.io/def456',
    alias: 'def456',
    createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    expirationDate: null,
    clickCount: 892,
    isActive: true,
  },
  {
    id: '3',
    originalUrl: 'https://example.com/best-practices-for-react-development-2024-edition',
    shortUrl: 'https://qlink.io/ghi789',
    alias: 'ghi789',
    createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    expirationDate: format(subDays(new Date(), -5), 'yyyy-MM-dd'),
    clickCount: 478,
    isActive: true,
  },
  {
    id: '4',
    originalUrl: 'https://example.com/digital-marketing-strategies-for-small-businesses',
    shortUrl: 'https://qlink.io/jkl012',
    alias: 'jkl012',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    expirationDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    clickCount: 103,
    isActive: false,
  },
  {
    id: '5',
    originalUrl: 'https://example.com/introduction-to-machine-learning-for-beginners',
    shortUrl: 'https://qlink.io/mno345',
    alias: 'mno345',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    expirationDate: format(subDays(new Date(), -60), 'yyyy-MM-dd'),
    clickCount: 289,
    isActive: true,
  },
  {
    id: '6',
    originalUrl: 'https://example.com/top-10-productivity-tools-for-remote-workers',
    shortUrl: 'https://qlink.io/pqr678',
    alias: 'pqr678',
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    expirationDate: null,
    clickCount: 67,
    isActive: true,
  },
];

// Function to generate detailed analytics for a specific link
export const getLinkDetails = (id: string): LinkDetailsData | null => {
  const link = mockLinks.find(link => link.id === id);
  if (!link) return null;
  
  // Generate clicks by date (last 30 days)
  const clicksByDate: ClickData[] = [];
  for (let i = 29; i >= 0; i--) {
    clicksByDate.push({
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      count: Math.floor(Math.random() * 50) + 1
    });
  }
  
  // Generate device data
  const deviceData: DeviceData[] = [
    { device: 'Mobile', count: Math.floor(link.clickCount * 0.6), percentage: 60 },
    { device: 'Desktop', count: Math.floor(link.clickCount * 0.35), percentage: 35 },
    { device: 'Tablet', count: Math.floor(link.clickCount * 0.05), percentage: 5 }
  ];
  
  // Generate browser data
  const browserData: BrowserData[] = [
    { browser: 'Chrome', count: Math.floor(link.clickCount * 0.45), percentage: 45 },
    { browser: 'Safari', count: Math.floor(link.clickCount * 0.25), percentage: 25 },
    { browser: 'Firefox', count: Math.floor(link.clickCount * 0.15), percentage: 15 },
    { browser: 'Edge', count: Math.floor(link.clickCount * 0.1), percentage: 10 },
    { browser: 'Others', count: Math.floor(link.clickCount * 0.05), percentage: 5 }
  ];
  
  // Generate location data
  const locationData: LocationData[] = [
    { country: 'United States', count: Math.floor(link.clickCount * 0.4), percentage: 40 },
    { country: 'United Kingdom', count: Math.floor(link.clickCount * 0.15), percentage: 15 },
    { country: 'Germany', count: Math.floor(link.clickCount * 0.12), percentage: 12 },
    { country: 'Canada', count: Math.floor(link.clickCount * 0.1), percentage: 10 },
    { country: 'India', count: Math.floor(link.clickCount * 0.08), percentage: 8 },
    { country: 'Australia', count: Math.floor(link.clickCount * 0.06), percentage: 6 },
    { country: 'Others', count: Math.floor(link.clickCount * 0.09), percentage: 9 }
  ];

  return {
    ...link,
    clicksByDate,
    deviceData,
    browserData,
    locationData
  };
};

// Get all links with optional filtering and pagination
export const getLinks = (
  search: string = '',
  page: number = 1,
  limit: number = 10
): { links: LinkData[], total: number } => {
  const searchLower = search.toLowerCase();
  
  const filteredLinks = mockLinks.filter(link => 
    link.originalUrl.toLowerCase().includes(searchLower) || 
    link.shortUrl.toLowerCase().includes(searchLower) ||
    link.alias.toLowerCase().includes(searchLower)
  );
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLinks = filteredLinks.slice(startIndex, endIndex);
  
  return {
    links: paginatedLinks,
    total: filteredLinks.length
  };
};

// Function to create a new short link
export const createShortLink = (
  originalUrl: string,
  customAlias?: string,
  expirationDate?: string
): LinkData => {
  const alias = customAlias || Math.random().toString(36).substring(2, 8);
  
  const newLink: LinkData = {
    id: (mockLinks.length + 1).toString(),
    originalUrl,
    shortUrl: `https://qlink.io/${alias}`,
    alias,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    expirationDate: expirationDate || null,
    clickCount: 0,
    isActive: true
  };
  
  // In a real app, we would persist this to the database
  // For the mock, we'll just log it
  console.log('Created new link:', newLink);
  
  return newLink;
};
