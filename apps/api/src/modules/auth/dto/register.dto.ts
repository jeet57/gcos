import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Intentionally minimal — email + password only. planStartDate /
 * targetEndDate (required on the User model, no DB default) get
 * sensible server-side defaults in AuthService.register(), since this
 * is a single-user portfolio app, not a generic multi-tenant signup.
 */
export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
