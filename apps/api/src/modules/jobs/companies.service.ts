import { Injectable, NotFoundException } from '@nestjs/common';
import type { CompanyDto } from '@gcos/types';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCompanyDto } from './dto/create-company.dto';
import type { UpdateCompanyDto } from './dto/update-company.dto';

/**
 * Company directory (M13) — backs the application-form autocomplete
 * (GET ?q=) and the per-company visa-sponsorship / watchlist flags.
 * Companies are shared reference data (not user-scoped) since GCOS is
 * a single-user app and a company is the same company across the
 * whole pipeline.
 */
@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query?: string): Promise<CompanyDto[]> {
    const companies = await this.prisma.company.findMany({
      ...(query ? { where: { name: { contains: query, mode: 'insensitive' as const } } } : {}),
      orderBy: { name: 'asc' },
      take: 20,
    });
    return companies.map((c) => this.toDto(c));
  }

  async create(dto: CreateCompanyDto): Promise<CompanyDto> {
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        city: dto.city,
        country: dto.country ?? 'Germany',
        sector: dto.sector ?? null,
        websiteUrl: dto.websiteUrl ?? null,
        hasSponsoredVisa: dto.hasSponsoredVisa ?? false,
        employeeCount: dto.employeeCount ?? null,
      },
    });
    return this.toDto(company);
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<CompanyDto> {
    const existing = await this.prisma.company.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Company not found');

    const company = await this.prisma.company.update({
      where: { id },
      data: {
        ...(dto.hasSponsoredVisa !== undefined && { hasSponsoredVisa: dto.hasSponsoredVisa }),
        ...(dto.visaEvidence !== undefined && { visaEvidence: dto.visaEvidence }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.watchlist !== undefined && { watchlist: dto.watchlist }),
      },
    });
    return this.toDto(company);
  }

  /** Find an existing company by exact (case-insensitive) name, or create one. */
  async findOrCreateByName(
    name: string,
    city?: string,
    country?: string,
  ): Promise<{ id: string }> {
    const existing = await this.prisma.company.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existing) return { id: existing.id };

    const created = await this.prisma.company.create({
      data: { name, city: city ?? 'Unknown', country: country ?? 'Germany' },
    });
    return { id: created.id };
  }

  private toDto(company: {
    id: string;
    name: string;
    city: string;
    country: string;
    sizeBucket: string | null;
    sector: string | null;
    websiteUrl: string | null;
    linkedinUrl: string | null;
    careersUrl: string | null;
    hasSponsoredVisa: boolean;
    employeeCount: number | null;
    watchlist: boolean;
  }): CompanyDto {
    return {
      id: company.id,
      name: company.name,
      city: company.city,
      country: company.country,
      sizeBucket: company.sizeBucket,
      sector: company.sector,
      websiteUrl: company.websiteUrl,
      linkedinUrl: company.linkedinUrl,
      careersUrl: company.careersUrl,
      hasSponsoredVisa: company.hasSponsoredVisa,
      employeeCount: company.employeeCount,
      watchlist: company.watchlist,
    };
  }
}
