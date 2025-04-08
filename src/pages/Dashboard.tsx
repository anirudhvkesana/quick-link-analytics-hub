
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LinkForm from '@/components/LinkForm';
import LinksTable from '@/components/LinksTable';
import SearchBar from '@/components/SearchBar';
import PaginationControls from '@/components/PaginationControls';
import { getLinks, LinkData } from '@/services/mockData';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const limit = 5; // Links per page
  
  useEffect(() => {
    const fetchLinks = () => {
      setLoading(true);
      const { links: fetchedLinks, total } = getLinks(searchQuery, currentPage, limit);
      setLinks(fetchedLinks);
      setTotalPages(Math.ceil(total / limit));
      setLoading(false);
    };
    
    fetchLinks();
  }, [searchQuery, currentPage, refreshTrigger]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLinkCreated = () => {
    // Refresh the links list
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Calculate total clicks across all links
  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
  
  // Get top performing links for the chart
  const topLinks = [...links]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 5)
    .map(link => ({
      name: link.alias,
      clicks: link.clickCount,
    }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage and analyze your shortened links</p>
          
          {/* Stats Overview */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{links.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{links.filter(link => link.isActive).length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Clicks Per Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {links.length ? Math.round(totalClicks / links.length).toLocaleString() : '0'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Top Performing Links Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>Click performance of your top 5 links</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topLinks} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={60} />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value.toLocaleString()} clicks`, 'Clicks']}
                      labelFormatter={(name) => `Link: ${name}`}
                    />
                    <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
                      {topLinks.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Create New Link */}
            <Card>
              <CardContent className="p-0">
                <LinkForm onLinkCreated={handleLinkCreated} />
              </CardContent>
            </Card>
          </div>
          
          {/* Links Table Section */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold">Your Links</h2>
              <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            </div>
            
            <LinksTable links={links} loading={loading} />
            
            <div className="mt-4 flex justify-center">
              <PaginationControls 
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
