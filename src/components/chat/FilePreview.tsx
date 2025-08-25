
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, Music, Video, Eye, File, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { chatFilesAPI, type FileAttachment } from '@/services/chatFilesAPI';
import { toast } from 'sonner';

interface FilePreviewProps {
  attachment: FileAttachment;
  onDelete?: () => void;
  canDelete?: boolean;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  attachment, 
  onDelete, 
  canDelete = false,
  className = "" 
}) => {
  const { filename, originalName, mimetype, size, url } = attachment;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (mimetype.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (mimetype.startsWith('audio/')) return <Music className="h-5 w-5 text-green-500" />;
    if (mimetype.startsWith('video/')) return <Video className="h-5 w-5 text-red-500" />;
    if (mimetype === 'application/pdf') return <FileText className="h-5 w-5 text-red-600" />;
    if (mimetype.startsWith('text/') || 
        mimetype === 'application/json' || 
        mimetype === 'application/xml' ||
        mimetype.includes('document') ||
        mimetype.includes('spreadsheet') ||
        mimetype.includes('presentation')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getFileType = (): 'chat-files' | 'chat-audio' | 'chat-video' => {
    if (mimetype.startsWith('audio/')) return 'chat-audio';
    if (mimetype.startsWith('video/')) return 'chat-video';
    return 'chat-files';
  };

  const handleDownload = async () => {
    try {
      const response = await chatFilesAPI.downloadFile(getFileType(), filename);
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Fichier téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement du fichier');
    }
  };

  const handlePreview = () => {
    const fileUrl = chatFilesAPI.getFileUrl(url);
    window.open(fileUrl, '_blank');
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const canPreview = () => {
    return mimetype.startsWith('image/') || 
           mimetype.startsWith('video/') || 
           mimetype.startsWith('audio/') ||
           mimetype === 'application/pdf' ||
           mimetype.startsWith('text/') ||
           mimetype === 'application/json' ||
           mimetype === 'application/xml' ||
           mimetype.includes('document') ||
           mimetype.includes('spreadsheet') ||
           mimetype.includes('presentation');
  };

  const isReadableText = () => {
    return mimetype.startsWith('text/') || 
           mimetype === 'application/json' ||
           mimetype === 'application/xml' ||
           mimetype === 'text/plain' ||
           mimetype === 'text/html' ||
           mimetype === 'text/css' ||
           mimetype === 'application/javascript';
  };

  const isOfficeDocument = () => {
    return mimetype.includes('document') ||
           mimetype.includes('spreadsheet') ||
           mimetype.includes('presentation') ||
           mimetype.includes('msword') ||
           mimetype.includes('excel') ||
           mimetype.includes('powerpoint') ||
           mimetype.includes('openxmlformats');
  };

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-w-sm ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getFileIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {originalName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(size)} • {mimetype}
          </p>
        </div>

        {canDelete && (
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Supprimer le fichier
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2 mt-3">
        <div className="flex space-x-2">
          {canPreview() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Aperçu
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Télécharger
          </Button>
        </div>
      </div>

      {/* Prévisualisation pour les images */}
      {mimetype.startsWith('image/') && (
        <div className="mt-2">
          <img
            src={chatFilesAPI.getFileUrl(url)}
            alt={originalName}
            className="max-w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handlePreview}
          />
        </div>
      )}

      {/* Lecteur pour les audios */}
      {mimetype.startsWith('audio/') && (
        <div className="mt-2">
          <audio
            controls
            className="w-full h-8"
            src={chatFilesAPI.getFileUrl(url)}
            preload="metadata"
          />
        </div>
      )}

      {/* Lecteur pour les vidéos */}
      {mimetype.startsWith('video/') && (
        <div className="mt-2">
          <video
            controls
            className="max-w-full h-32 rounded border"
            src={chatFilesAPI.getFileUrl(url)}
            preload="metadata"
          />
        </div>
      )}

      {/* Prévisualisation pour les fichiers texte lisibles */}
      {isReadableText() && (
        <div className="mt-2">
          <div className="max-h-32 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-2 rounded border text-xs">
            <iframe
              src={chatFilesAPI.getFileUrl(url)}
              className="w-full h-24 border-0"
              title={originalName}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* Prévisualisation pour les PDFs */}
      {mimetype === 'application/pdf' && (
        <div className="mt-2">
          <div className="bg-gray-100 dark:bg-gray-900 rounded border p-2">
            <iframe
              src={`${chatFilesAPI.getFileUrl(url)}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-40 border-0 rounded"
              title={originalName}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      )}

      {/* Prévisualisation pour les documents Office */}
      {isOfficeDocument() && (
        <div className="mt-2">
          <div className="bg-gray-100 dark:bg-gray-900 rounded border p-2 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Document Office
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Cliquez sur "Aperçu" ou "Télécharger" pour ouvrir
            </p>
          </div>
        </div>
      )}

      {/* Message pour les fichiers non prévisualisables */}
      {!canPreview() && (
        <div className="mt-2">
          <div className="bg-gray-100 dark:bg-gray-900 rounded border p-2 text-center">
            {getFileIcon()}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Fichier disponible au téléchargement
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
