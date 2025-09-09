// utils/generateWalletId.ts

export type UserRole = 'trash-hero' | 'impact-warrior' | 'business' | 'admin';

export function generateWalletId(userId: number, role: UserRole): string {
  const rolePrefixes: Record<UserRole, string> = {
    'trash-hero': 'TH',
    'impact-warrior': 'IW',
    'business': 'ED', // EcoDefender
    'admin': 'AD',
  };

  const prefix = rolePrefixes[role] || 'PEAR';
  const formattedUserId = userId.toString().padStart(8, '0');

  return `${prefix}-${formattedUserId}`;
}

export function formatWalletIdForDisplay(walletId: string): string {
  // For privacy in public feeds, can mask middle digits
  // Example: "TH-90837421" becomes "TH-****7421"
  if (walletId.length < 8) return walletId;
  
  const parts = walletId.split('-');
  if (parts.length !== 2) return walletId;
  
  const [prefix, id] = parts;
  if (id.length < 4) return walletId;
  
  const maskedId = '****' + id.slice(-4);
  return `${prefix}-${maskedId}`;
}

export function validateWalletId(walletId: string): boolean {
  // Basic validation for PEAR wallet ID format
  const walletIdRegex = /^(TH|IW|ED|AD|PEAR)-\d{8}$/;
  return walletIdRegex.test(walletId);
}