import { ADD_NEW_CLICK, CLICK_QUEUE } from '@app/queues/click/constants';
import { ClickJob } from '@app/queues/click/types/click.job';
import { ClickService } from '@app/resources/routes/clicks/click.service';
import Click from '@app/resources/routes/clicks/entities/click.entity';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor(CLICK_QUEUE)
export class ClickConsumer {
  private readonly logger = new Logger(ClickConsumer.name);

  constructor(private readonly clickService: ClickService) {}

  @Process(ADD_NEW_CLICK)
  async handleClickJob(job: Job<ClickJob>) {
    const { urlId, userId } = job.data;

    if (!urlId) throw new Error('Invalid click data');

    const clickToCreate = { urlId, userId } as Click;

    await this.clickService.create(clickToCreate);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} in queue ${CLICK_QUEUE} is now active`);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(`Job ${job.id} in queue ${CLICK_QUEUE} has been completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: any) {
    this.logger.error(
      `Job ${job.id} in queue ${CLICK_QUEUE} failed with error: ${error.message}`,
    );
  }
}
