/**
 * Auth API shapes.
 * Added in M08 (Authentication — JWT + Refresh Token Rotation).
 *
 * Only the access token crosses the network in the JSON body — the
 * refresh token travels exclusively as an HttpOnly cookie and never
 * appears in any of these types (TAD §6.2).
 */

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: AuthUserDto;
}

export interface RefreshResponseDto {
  accessToken: string;
}
