
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Calendar, Globe, Monitor, Smartphone, Clock } from 'lucide-react';
import { getLinkDetails, LinkDetailsData } from '@/services/mockData';
import QRCodeComponent from '@/components/QRCode';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const LinkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [linkData, setLinkData] = useState<LinkDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const data = getLinkDetails(id);
      setLinkData(data);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading link details...</p>
        </main>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-6">
          <div className="container mx-auto">
            <Button variant="link" asChild className="mb-6 p-0">
              <RouterLink to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </RouterLink>
            </Button>
            
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Link Not Found</h2>
              <p className="text-muted-foreground">The link you are looking for does not exist.</p>
              <Button asChild className="mt-4">
                <RouterLink to="/dashboard">Return to Dashboard</RouterLink>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#6366f1'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <Button variant="link" asChild className="mb-6 p-0">
            <RouterLink to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </RouterLink>
          </Button>
          
          {/* Link Overview */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Link Analytics</CardTitle>
                  <Badge className={linkData.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                    {linkData.isActive ? 'Active' : 'Expired'}
                  </Badge>
                </div>
                <CardDescription className="break-all">{linkData.originalUrl}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Short URL</span>
                    <a 
                      href={linkData.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {linkData.shortUrl}
                    </a>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Alias</span>
                    <span>{linkData.alias}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Created</span>
                      <span className="text-sm text-muted-foreground">{linkData.createdAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Expires</span>
                      <span className="text-sm text-muted-foreground">{linkData.expirationDate || 'Never'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan to visit the short link</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodeComponent url={linkData.shortUrl} />
              </CardContent>
            </Card>
          </div>
          
          {/* Stats Overview */}
          <div className="grid gap-6 mb-8 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{linkData.clickCount.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Mobile Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {linkData.deviceData.find(d => d.device === 'Mobile')?.count.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {linkData.deviceData.find(d => d.device === 'Mobile')?.percentage || 0}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Desktop Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {linkData.deviceData.find(d => d.device === 'Desktop')?.count.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {linkData.deviceData.find(d => d.device === 'Desktop')?.percentage || 0}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Top Country</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {linkData.locationData[0]?.country || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {linkData.locationData[0]?.percentage || 0}% of total
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed Analytics Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="clicks">
                <TabsList className="mb-6">
                  <TabsTrigger value="clicks">Clicks Over Time</TabsTrigger>
                  <TabsTrigger value="devices">Devices</TabsTrigger>
                  <TabsTrigger value="browsers">Browsers</TabsTrigger>
                  <TabsTrigger value="locations">Locations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="clicks" className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={linkData.clicksByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value} clicks`, 'Clicks']}
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="devices" className="pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={linkData.deviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="device"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {linkData.deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(value: number) => [`${value.toLocaleString()} clicks`, 'Clicks']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-4">
                      {linkData.deviceData.map((device, index) => (
                        <div key={device.device} className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{device.device}</span>
                              <span className="text-sm font-medium">{device.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${device.percentage}%`, 
                                  backgroundColor: COLORS[index % COLORS.length] 
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="browsers" className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={linkData.browserData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="browser" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} clicks`, 'Clicks']}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {linkData.browserData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="locations" className="pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={linkData.locationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="country"
                            label={({ name, percent }) => `${name.length > 10 ? `${name.slice(0, 10)}...` : name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {linkData.locationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(value: number) => [`${value.toLocaleString()} clicks`, 'Clicks']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-4">
                      {linkData.locationData.map((location, index) => (
                        <div key={location.country} className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{location.country}</span>
                              <span className="text-sm font-medium">{location.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${location.percentage}%`, 
                                  backgroundColor: COLORS[index % COLORS.length] 
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LinkDetails;
