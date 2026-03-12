import { useState, useEffect, useCallback } from 'react';
import { api, MailtmMessage } from '@/services/api';
import { Email, EmailAccount } from '@/types/email';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to convert Mailtm message to our Email format
const convertMailtmMessageToEmail = (message: MailtmMessage): Email => {
  const now = new Date();
  const messageTime = new Date(message.createdAt);
  const diffMs = now.getTime() - messageTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  let timeAgo: string;
  if (diffMins < 1) {
    timeAgo = 'Just now';
  } else if (diffMins < 60) {
    timeAgo = `${diffMins} min ago`;
  } else if (diffMins < 1440) {
    timeAgo = `${Math.floor(diffMins / 60)} hr ago`;
  } else {
    timeAgo = `${Math.floor(diffMins / 1440)} days ago`;
  }

  // Categorize email based on subject and sender
  let category: 'verification' | 'promo' | 'alert' | 'general' = 'general';
  const subject = message.subject.toLowerCase();
  const sender = message.from.address.toLowerCase();
  
  if (subject.includes('verify') || subject.includes('confirm') || subject.includes('activate')) {
    category = 'verification';
  } else if (sender.includes('amazon') || sender.includes('order') || subject.includes('shipped')) {
    category = 'alert';
  } else if (subject.includes('sale') || subject.includes('discount') || subject.includes('offer')) {
    category = 'promo';
  }

  return {
    id: message.id,
    sender: message.from.name || message.from.address.split('@')[0],
    senderEmail: message.from.address,
    subject: message.subject,
    preview: message.intro,
    body: message.html || message.text || message.intro,
    time: timeAgo,
    timestamp: messageTime,
    read: message.seen,
    category,
    hasAttachment: message.hasAttachments,
  };
};

export const useEmail = () => {
  const [account, setAccount] = useState<EmailAccount | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(3600); // 1 hour in seconds

  // Countdown timer for session
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 0) {
          // Session expired, clear data
          setAccount(null);
          setEmails([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate new email account
  const generateEmail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.generateEmail();
      
      if (response.success && response.data) {
        setAccount(response.data);
        setEmails([]);
        setSessionTime(3600); // Reset session time
        toast.success('New email address generated!');
        
        // Auto-fetch messages after a short delay
        setTimeout(() => {
          fetchMessages(response.data.email, response.data.password);
        }, 1000);
      } else {
        throw new Error(response.error || 'Failed to generate email');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for current account
  const fetchMessages = useCallback(async (email?: string, password?: string) => {
    const currentEmail = email || account?.email;
    const currentPassword = password || account?.password;
    
    if (!currentEmail || !currentPassword) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getMessages(currentEmail, currentPassword);
      
      if (response.success && response.data) {
        const messages = response.data['hydra:member'] || [];
        const convertedEmails = messages.map(convertMailtmMessageToEmail);
        setEmails(convertedEmails);
      } else {
        throw new Error(response.error || 'Failed to fetch messages');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [account]);

  // Get single message
  const getMessage = useCallback(async (messageId: string) => {
    if (!account?.email || !account?.password) {
      return null;
    }

    try {
      const response = await api.getMessage(account.email, account.password, messageId);
      
      if (response.success && response.data) {
        return convertMailtmMessageToEmail(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch message');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch message';
      toast.error(errorMessage);
      return null;
    }
  }, [account]);

  // Refresh messages
  const refreshMessages = useCallback(() => {
    if (account) {
      fetchMessages(account.email, account.password);
      toast.info('Inbox refreshed');
    }
  }, [account, fetchMessages]);

  // Format session time
  const formatSessionTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    if (!account) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [account, fetchMessages]);

  return {
    account,
    emails,
    loading,
    error,
    sessionTime,
    generateEmail,
    fetchMessages,
    getMessage,
    refreshMessages,
    formatSessionTime,
  };
};
