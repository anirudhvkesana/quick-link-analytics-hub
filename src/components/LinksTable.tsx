
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LinkData } from '@/services/mockData';
import { QrCode, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QRCodeComponent from '@/components/QRCode';

type LinksTableProps = {
  links: LinkData[];
  loading?: boolean;
};

const LinksTable = ({ links, loading = false }: LinksTableProps) => {
  const truncateUrl = (url: string, maxLength: number = 30) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading links...</div>;
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8 bg-card border rounded-lg">
        <p className="text-muted-foreground">No links found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Short URL</TableHead>
            <TableHead className="w-[30%]">Original URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={link.shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {link.alias}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.shortUrl}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncateUrl(link.originalUrl)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.originalUrl}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{link.createdAt}</TableCell>
              <TableCell>{link.expirationDate || 'Never'}</TableCell>
              <TableCell>{link.clickCount.toLocaleString()}</TableCell>
              <TableCell>
                {link.isActive ? (
                  <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                ) : (
                  <Badge variant="secondary">Expired</Badge>
                )}
              </TableCell>
              <TableCell className="flex items-center justify-end space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4" />
                      <span className="sr-only">View QR Code</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>QR Code for {link.alias}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-4">
                      <QRCodeComponent url={link.shortUrl} />
                      <p className="mt-4 text-sm text-center text-muted-foreground">{link.shortUrl}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Link to={`/link/${link.id}`}>
                  <Button>Analytics</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LinksTable;
