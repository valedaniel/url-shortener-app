import { Module } from '@nestjs/common';

import { TokenService } from '@app/resources/private/token/token.service';

const services = [TokenService];

@Module({
  exports: services,
  providers: services,
})
export class TokenModule {}
