
import React from 'react';
import FilePreview from './FilePreview';
import { type FileAttachment as FileAttachmentType } from '@/services/chatFilesAPI';

interface FileAttachmentProps {
  attachment: FileAttachmentType;
  onDelete?: () => void;
  canDelete?: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ 
  attachment, 
  onDelete, 
  canDelete = false 
}) => {
  return (
    <FilePreview 
      attachment={attachment}
      onDelete={onDelete}
      canDelete={canDelete}
    />
  );
};

export default FileAttachment;
