export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  timestamp: Date;
  read: boolean;
  category: 'verification' | 'promo' | 'alert' | 'general';
  hasAttachment?: boolean;
}

export interface EmailAccount {
  email: string;
  password: string;
  accountId?: string;
}
