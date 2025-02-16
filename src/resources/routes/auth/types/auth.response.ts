import User from '@app/resources/routes/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ type: User, description: 'The authenticated user details' })
  user: Omit<User, 'password'>;

  @ApiProperty({
    type: String,
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'JWT refresh token for obtaining new access tokens',
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
  })
  refreshToken: string;
}
