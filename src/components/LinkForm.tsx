
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createShortLink } from '@/services/mockData';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type LinkFormProps = {
  onLinkCreated: () => void;
};

const LinkForm = ({ onLinkCreated }: LinkFormProps) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [useCustomAlias, setUseCustomAlias] = useState(false);
  const [customAlias, setCustomAlias] = useState('');
  const [useExpiration, setUseExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    if (useCustomAlias && !customAlias) {
      toast.error('Please enter a custom alias or disable the custom alias option');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      createShortLink(
        originalUrl,
        useCustomAlias ? customAlias : undefined,
        useExpiration && expirationDate ? format(expirationDate, 'yyyy-MM-dd') : undefined
      );

      toast.success('Link created successfully!');
      setOriginalUrl('');
      setUseCustomAlias(false);
      setCustomAlias('');
      setUseExpiration(false);
      setExpirationDate(undefined);
      onLinkCreated();
    } catch (error) {
      toast.error('Failed to create link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="originalUrl">URL to Shorten</Label>
          <Input
            id="originalUrl"
            placeholder="https://example.com/your-long-url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useCustomAlias"
            checked={useCustomAlias}
            onCheckedChange={(checked) => setUseCustomAlias(checked === true)}
          />
          <Label htmlFor="useCustomAlias" className="cursor-pointer">Use custom alias</Label>
        </div>
        
        {useCustomAlias && (
          <div className="space-y-2">
            <Label htmlFor="customAlias">Custom Alias</Label>
            <Input
              id="customAlias"
              placeholder="my-custom-alias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useExpiration"
            checked={useExpiration}
            onCheckedChange={(checked) => setUseExpiration(checked === true)}
          />
          <Label htmlFor="useExpiration" className="cursor-pointer">Set expiration date</Label>
        </div>
        
        {useExpiration && (
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expirationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expirationDate ? format(expirationDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expirationDate}
                  onSelect={setExpirationDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-brand-blue-light to-brand-purple hover:from-brand-purple hover:to-brand-blue-light transition-all duration-300" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Short Link'}
        </Button>
      </form>
    </div>
  );
};

export default LinkForm;
