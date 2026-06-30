import type { AuthUserDto } from '@gcos/types';

/**
 * Response shape for /auth/register and /auth/login. Mirrors
 * LoginResponseDto from @gcos/types — kept as a separate class here
 * (rather than importing the interface directly into the controller
 * return type) so Swagger's DocumentBuilder can introspect it.
 */
export class AuthResponseDto {
  accessToken!: string;
  user!: AuthUserDto;
}
