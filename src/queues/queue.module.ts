import { ClickConsumer } from '@app/queues/click/click.consumer';
import { ClickProducer } from '@app/queues/click/click.producer';
import { CLICK_QUEUE } from '@app/queues/click/constants';
import { ClickModule } from '@app/resources/routes/clicks/click.module';
import { ApplicationEnv } from '@app/utils/application-settings';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: ApplicationEnv.REDIS_HOST,
        port: ApplicationEnv.REDIS_PORT,
      },
    }),
    BullModule.registerQueue({
      name: CLICK_QUEUE,
    }),
    forwardRef(() => ClickModule),
  ],
  providers: [ClickConsumer, ClickProducer],
  exports: [ClickConsumer, ClickProducer],
})
export class QueueModule {}
