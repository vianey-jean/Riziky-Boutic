
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Image, FileText, Music, Video } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // en MB
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  accept = "*/*",
  maxSize = 50,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (accept.includes('image/')) return <Image className="h-4 w-4" />;
    if (accept.includes('audio/')) return <Music className="h-4 w-4" />;
    if (accept.includes('video/')) return <Video className="h-4 w-4" />;
    if (accept.includes('.pdf') || accept.includes('.doc')) return <FileText className="h-4 w-4" />;
    return <Paperclip className="h-4 w-4" />;
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="shrink-0 border-gray-300 hover:bg-gray-200"
      >
        {getFileIcon()}
      </Button>
    </>
  );
};

export default FileUploadButton;
