// components/ChatModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';

interface Lead {
  name: string;
  sessionId?: string;
  assignedAgent?: string;
}

interface ChatModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ lead, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-modal hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-100">
            <MessageSquare size={20} />
            Chat with {lead.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="h-[400px] flex items-center justify-center text-slate-300">
            Chat functionality is currently disabled
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
