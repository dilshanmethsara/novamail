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

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'GitHub',
    senderEmail: 'noreply@github.com',
    subject: 'Verify your email address',
    preview: 'Please verify your email address to complete your GitHub account setup...',
    body: `<p>Hello,</p><p>Please click the link below to verify your email address and complete your GitHub account setup.</p><p><a href="#">Verify email address</a></p><p>If you didn't create a GitHub account, you can safely ignore this email.</p><p>Thanks,<br/>The GitHub Team</p>`,
    time: '2 min ago',
    timestamp: new Date(Date.now() - 120000),
    read: false,
    category: 'verification',
  },
  {
    id: '2',
    sender: 'Spotify',
    senderEmail: 'no-reply@spotify.com',
    subject: 'Confirm your Spotify account',
    preview: 'Welcome to Spotify! Please confirm your email to start listening...',
    body: `<p>Welcome to Spotify!</p><p>Please confirm your email address by clicking the button below to start enjoying millions of songs.</p><p><a href="#">Confirm Email</a></p><p>Happy listening!</p>`,
    time: '5 min ago',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    category: 'verification',
  },
  {
    id: '3',
    sender: 'Amazon',
    senderEmail: 'auto-confirm@amazon.com',
    subject: 'Your order #402-8827163 has shipped',
    preview: 'Great news! Your package is on its way and will arrive by Thursday...',
    body: `<p>Hello,</p><p>Your order #402-8827163 has shipped! Track your package using the link below.</p><p><a href="#">Track Package</a></p><p>Estimated delivery: Thursday, March 14</p>`,
    time: '18 min ago',
    timestamp: new Date(Date.now() - 1080000),
    read: true,
    category: 'alert',
  },
  {
    id: '4',
    sender: 'Netflix',
    senderEmail: 'info@mailer.netflix.com',
    subject: 'New arrivals you might enjoy',
    preview: 'Check out the latest movies and shows added to Netflix this week...',
    body: `<p>Hi there,</p><p>We've added some amazing new titles this week that we think you'll love. Check them out!</p><ul><li>The Last of Us - Season 2</li><li>Oppenheimer</li><li>Wednesday - Season 2</li></ul>`,
    time: '1 hr ago',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    category: 'promo',
  },
  {
    id: '5',
    sender: 'Discord',
    senderEmail: 'noreply@discord.com',
    subject: 'Reset your password',
    preview: 'We received a request to reset your Discord password. Click here...',
    body: `<p>Hello,</p><p>We received a request to reset your Discord password. Click the link below to set a new password.</p><p><a href="#">Reset Password</a></p><p>This link expires in 24 hours.</p>`,
    time: '2 hrs ago',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    category: 'alert',
  },
];

export const generateRandomEmail = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const len = 8 + Math.floor(Math.random() * 4);
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const domains = ['tmpbox.io', 'quickmail.dev', 'ghostmail.net'];
  return `${result}@${domains[Math.floor(Math.random() * domains.length)]}`;
};
