import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CoffeeChatDto,
  LinkedinPostDto,
  NetworkConnectionDto,
  NetworkStatsDto,
} from '@gcos/types';
import type {
  ConnectionStatus as PrismaConnectionStatus,
  ConnectionType as PrismaConnectionType,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCoffeeChatDto } from './dto/create-coffee-chat.dto';
import type { CreateConnectionDto } from './dto/create-connection.dto';
import type { CreateLinkedinPostDto } from './dto/create-linkedin-post.dto';
import type { UpdateConnectionDto } from './dto/update-connection.dto';

/**
 * Networking tracker (M15) — connection CRM, coffee-chat log,
 * LinkedIn post calendar, and stats. No readiness-score trigger here
 * because the networkingScore dimension is not part of the 7
 * dimensions defined in ReadinessScoreService (PRD v2 §1.4 lists:
 * study, academy, application, portfolio, german, interview, aiTooling).
 * Networking data feeds the dashboard's weekly-progress view only.
 */
@Injectable()
export class NetworkingService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Connections ─────────────────────────────────────────────────────

  async createConnection(userId: string, dto: CreateConnectionDto): Promise<NetworkConnectionDto> {
    const connection = await this.prisma.networkConnection.create({
      data: {
        userId,
        fullName: dto.fullName,
        companyId: dto.companyId ?? null,
        roleTitle: dto.roleTitle ?? null,
        city: dto.city ?? null,
        linkedinUrl: dto.linkedinUrl ?? null,
        connectionType: (dto.connectionType as PrismaConnectionType | undefined) ?? null,
        status: (dto.status as PrismaConnectionStatus | undefined) ?? 'sent',
        connectedDate: dto.connectedDate ? new Date(dto.connectedDate) : null,
        isAtTargetCompany: dto.isAtTargetCompany ?? false,
        notes: dto.notes ?? null,
      },
    });
    return this.toConnectionDto(connection);
  }

  async listConnections(userId: string): Promise<NetworkConnectionDto[]> {
    const connections = await this.prisma.networkConnection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return connections.map((c) => this.toConnectionDto(c));
  }

  async updateConnection(userId: string, id: string, dto: UpdateConnectionDto): Promise<NetworkConnectionDto> {
    const existing = await this.prisma.networkConnection.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Connection not found');

    const connection = await this.prisma.networkConnection.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status as PrismaConnectionStatus }),
        ...(dto.lastInteraction !== undefined && { lastInteraction: new Date(dto.lastInteraction) }),
        ...(dto.isAtTargetCompany !== undefined && { isAtTargetCompany: dto.isAtTargetCompany }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
    return this.toConnectionDto(connection);
  }

  // ── Coffee chats ────────────────────────────────────────────────────

  async createCoffeeChat(userId: string, connectionId: string, dto: CreateCoffeeChatDto): Promise<CoffeeChatDto> {
    const connection = await this.prisma.networkConnection.findFirst({ where: { id: connectionId, userId } });
    if (!connection) throw new NotFoundException('Connection not found');

    const chat = await this.prisma.coffeeChat.create({
      data: {
        connectionId,
        chatDate: new Date(dto.chatDate),
        keyInsights: dto.keyInsights ?? null,
        followUpNotes: dto.followUpNotes ?? null,
      },
    });

    // Auto-advance connection status to coffee_chat_done if still earlier
    if (!['coffee_chat_done', 'referral'].includes(connection.status)) {
      await this.prisma.networkConnection.update({
        where: { id: connectionId },
        data: { status: 'coffee_chat_done', lastInteraction: new Date(dto.chatDate) },
      });
    }

    return this.toChatDto(chat);
  }

  async listCoffeeChats(userId: string, connectionId: string): Promise<CoffeeChatDto[]> {
    const connection = await this.prisma.networkConnection.findFirst({ where: { id: connectionId, userId } });
    if (!connection) throw new NotFoundException('Connection not found');

    const chats = await this.prisma.coffeeChat.findMany({
      where: { connectionId },
      orderBy: { chatDate: 'desc' },
    });
    return chats.map((c) => this.toChatDto(c));
  }

  // ── LinkedIn posts ──────────────────────────────────────────────────

  async createPost(userId: string, dto: CreateLinkedinPostDto): Promise<LinkedinPostDto> {
    const post = await this.prisma.linkedinPost.create({
      data: {
        userId,
        publishedDate: new Date(dto.publishedDate),
        topic: dto.topic,
        postUrl: dto.postUrl ?? null,
        notes: dto.notes ?? null,
      },
    });
    return this.toPostDto(post);
  }

  async listPosts(userId: string): Promise<LinkedinPostDto[]> {
    const posts = await this.prisma.linkedinPost.findMany({
      where: { userId },
      orderBy: { publishedDate: 'desc' },
    });
    return posts.map((p) => this.toPostDto(p));
  }

  // ── Stats ───────────────────────────────────────────────────────────

  async getStats(userId: string): Promise<NetworkStatsDto> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [connections, postsThisMonth] = await Promise.all([
      this.prisma.networkConnection.findMany({
        where: { userId },
        select: { status: true, isAtTargetCompany: true },
      }),
      this.prisma.linkedinPost.count({
        where: { userId, publishedDate: { gte: monthStart, lt: monthEnd } },
      }),
    ]);

    const conns = connections as { status: string; isAtTargetCompany: boolean }[];

    return {
      totalConnections: conns.length,
      connectedCount: conns.filter((c) => c.status !== 'sent').length,
      coffeeChatsDone: conns.filter((c) => ['coffee_chat_done', 'referral'].includes(c.status)).length,
      referrals: conns.filter((c) => c.status === 'referral').length,
      atTargetCompany: conns.filter((c) => c.isAtTargetCompany).length,
      linkedinPostsThisMonth: postsThisMonth,
    };
  }

  // ── Mappers ─────────────────────────────────────────────────────────

  private toConnectionDto(c: {
    id: string; fullName: string; companyId: string | null; roleTitle: string | null;
    city: string | null; linkedinUrl: string | null; connectionType: string | null;
    status: string; connectedDate: Date | null; lastInteraction: Date | null;
    isAtTargetCompany: boolean; notes: string | null;
  }): NetworkConnectionDto {
    return {
      id: c.id, fullName: c.fullName, companyId: c.companyId, roleTitle: c.roleTitle,
      city: c.city, linkedinUrl: c.linkedinUrl, connectionType: c.connectionType,
      status: c.status,
      connectedDate: c.connectedDate ? c.connectedDate.toISOString().slice(0, 10) : null,
      lastInteraction: c.lastInteraction ? c.lastInteraction.toISOString().slice(0, 10) : null,
      isAtTargetCompany: c.isAtTargetCompany, notes: c.notes,
    };
  }

  private toChatDto(c: {
    id: string; connectionId: string; chatDate: Date;
    keyInsights: string | null; followUpNotes: string | null;
  }): CoffeeChatDto {
    return {
      id: c.id, connectionId: c.connectionId,
      chatDate: c.chatDate.toISOString().slice(0, 10),
      keyInsights: c.keyInsights, followUpNotes: c.followUpNotes,
    };
  }

  private toPostDto(p: {
    id: string; publishedDate: Date; topic: string; postUrl: string | null; notes: string | null;
  }): LinkedinPostDto {
    return {
      id: p.id, publishedDate: p.publishedDate.toISOString().slice(0, 10),
      topic: p.topic, postUrl: p.postUrl, notes: p.notes,
    };
  }
}
