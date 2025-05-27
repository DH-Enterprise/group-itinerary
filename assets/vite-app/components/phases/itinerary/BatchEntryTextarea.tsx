
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface BatchEntryTextareaProps {
  onSave: (items: string[]) => void;
  onCancel: () => void;
  placeholder: string;
}

const BatchEntryTextarea = ({ onSave, onCancel, placeholder }: BatchEntryTextareaProps) => {
  const [text, setText] = useState('');

  const handleSave = () => {
    // Split by newline and filter out empty lines
    const items = text
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    onSave(items);
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Check className="h-4 w-4 mr-1" />
          Save Items
        </Button>
      </div>
    </div>
  );
};

export default BatchEntryTextarea;
