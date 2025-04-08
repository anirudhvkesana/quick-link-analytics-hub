
import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type QRCodeProps = {
  url: string;
  size?: number;
};

const QRCodeComponent = ({ url, size = 200 }: QRCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `qrcode-${url.split('/').pop()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} className="bg-white p-4 rounded-lg">
        <QRCodeCanvas 
          value={url} 
          size={size}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>
      
      <Button 
        onClick={downloadQRCode} 
        className="mt-4"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
};

export default QRCodeComponent;
