import { IsIn } from 'class-validator';

export class UpdateGermanUnitDto {
  @IsIn(['not_started', 'in_progress', 'completed'])
  status!: 'not_started' | 'in_progress' | 'completed';
}
