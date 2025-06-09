
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Smile, Mic, Paperclip } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onEmojiSelect: (emoji: any) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onEmojiSelect,
  disabled = false,
  placeholder = "Écrivez votre message..."
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 border-gray-300 hover:bg-gray-200"
        >
          <Paperclip className="h-4 w-4 text-gray-600" />
        </Button>
        
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-20 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full"
            disabled={disabled}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-gray-200"
                >
                  <Smile className="h-4 w-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" side="top">
                <Picker 
                  data={data} 
                  onEmojiSelect={onEmojiSelect}
                  theme="light"
                />
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-200"
            >
              <Mic className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md rounded-full px-6"
          disabled={disabled || !value.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Envoyer
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
