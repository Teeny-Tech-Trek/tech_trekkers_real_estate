// components/ChatModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, User, Bot } from 'lucide-react';
import { Chat, Lead } from '../types/lead';
import { fetchChatByAgentAndSession, sendChatMessage } from '../services/leadApi';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface ChatModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ lead, isOpen, onClose }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && lead.sessionId && lead.assignedAgent) {
      setIsLoading(true);
      fetchChatByAgentAndSession(lead.assignedAgent, lead.sessionId)
        .then((chatData) => {
          setChat(chatData);
          setIsLoading(false);
        })
        .catch((error) => {
          toast({ title: 'Error', description: 'Failed to load chat history', variant: 'destructive' });
          setIsLoading(false);
        });
    }
  }, [isOpen, lead.sessionId, lead.assignedAgent]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !lead.sessionId || !lead.assignedAgent) return;

    try {
      const updatedChat = await sendChatMessage(lead.assignedAgent, lead.sessionId, {
        sender: 'agent',
        text: message,
      });
      setChat(updatedChat);
      setMessage('');
      toast({ title: 'Success', description: 'Message sent successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Chat with {lead.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <p className="text-center text-slate-600">Loading chat history...</p>
            ) : !chat || chat.messages.length === 0 ? (
              <p className="text-center text-slate-600">No chat history available</p>
            ) : (
              chat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === 'agent'
                        ? 'bg-blue-600 text-white'
                        : msg.sender === 'user'
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.sender === 'agent' ? (
                        <User size={14} />
                      ) : msg.sender === 'user' ? (
                        <User size={14} />
                      ) : (
                        <Bot size={14} />
                      )}
                      <span className="text-xs font-medium">
                        {msg.sender === 'agent' ? 'You' : msg.sender === 'user' ? lead.name : 'System'}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                    {msg.propertyCards && msg.propertyCards.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.propertyCards.map((card) => (
                          <Card key={card.id} className="bg-white/80">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={card.image || '/default-property.jpg'}
                                  alt={card.title}
                                  className="w-16 h-16 rounded object-cover"
                                />
                                <div>
                                  <p className="font-medium text-sm">{card.title}</p>
                                  <p className="text-xs text-slate-600">${card.price.toLocaleString()}</p>
                                  <p className="text-xs text-slate-600">{card.location}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;