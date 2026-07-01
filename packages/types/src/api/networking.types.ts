/**
 * Networking tracker API shapes.
 * Mirrors network_connections / coffee_chats / linkedin_posts tables
 * (PRD v2 §7.5, TAD §7).
 */

export interface NetworkConnectionDto {
  id: string;
  fullName: string;
  companyId: string | null;
  roleTitle: string | null;
  city: string | null;
  linkedinUrl: string | null;
  connectionType: string | null;
  status: string;
  connectedDate: string | null;
  lastInteraction: string | null;
  isAtTargetCompany: boolean;
  notes: string | null;
}

export interface CoffeeChatDto {
  id: string;
  connectionId: string;
  chatDate: string;
  keyInsights: string | null;
  followUpNotes: string | null;
}

export interface LinkedinPostDto {
  id: string;
  publishedDate: string;
  topic: string;
  postUrl: string | null;
  notes: string | null;
}

export interface NetworkStatsDto {
  totalConnections: number;
  connectedCount: number;
  coffeeChatsDone: number;
  referrals: number;
  atTargetCompany: number;
  linkedinPostsThisMonth: number;
}
