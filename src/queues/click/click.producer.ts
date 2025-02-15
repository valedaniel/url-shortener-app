import { ADD_NEW_CLICK, CLICK_QUEUE } from '@app/queues/click/constants';
import { ClickJob } from '@app/queues/click/types/click.job';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ClickProducer {
  constructor(@InjectQueue(CLICK_QUEUE) private readonly clickQueue: Queue) {}

  async addClick(clickJob: ClickJob) {
    await this.clickQueue.add(ADD_NEW_CLICK, clickJob);
  }
}
