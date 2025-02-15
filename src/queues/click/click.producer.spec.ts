import { ClickProducer } from '@app/queues/click/click.producer';
import { ADD_NEW_CLICK, CLICK_QUEUE } from '@app/queues/click/constants';
import { ClickJob } from '@app/queues/click/types/click.job';
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';

describe('ClickProducer', () => {
  let clickProducer: ClickProducer;
  let clickQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickProducer,
        {
          provide: getQueueToken(CLICK_QUEUE),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    clickProducer = module.get<ClickProducer>(ClickProducer);
    clickQueue = module.get<Queue>(getQueueToken(CLICK_QUEUE));
  });

  it('should be defined', () => {
    expect(clickProducer).toBeDefined();
  });

  it('should add a new click job to the queue', async () => {
    const clickJob: ClickJob = {
      urlId: 1,
      userId: 1,
    };
    await clickProducer.addClick(clickJob);
    expect(clickQueue.add).toHaveBeenCalledWith(ADD_NEW_CLICK, clickJob);
  });
});
