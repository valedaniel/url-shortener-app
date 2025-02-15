import { CLICK_QUEUE } from '@app/queues/click/constants';
import { ClickService } from '@app/resources/routes/clicks/click.service';
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { ClickConsumer } from './click.consumer';

describe('ClickConsumer', () => {
  let clickConsumer: ClickConsumer;
  let clickService: ClickService;

  const mockClickService = {
    create: jest.fn(),
  };

  const mockJob = {
    id: 10,
    data: {
      urlId: 1,
      userId: 1,
    },
  } as Job;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickConsumer,
        { provide: ClickService, useValue: mockClickService },
        { provide: getQueueToken(CLICK_QUEUE), useValue: {} },
      ],
    }).compile();

    clickConsumer = module.get<ClickConsumer>(ClickConsumer);
    clickService = module.get<ClickService>(ClickService);
  });

  it('should be defined', () => {
    expect(clickConsumer).toBeDefined();
  });

  describe('handleClickJob', () => {
    it('should call clickService.create with correct parameters', async () => {
      await clickConsumer.handleClickJob(mockJob);
      expect(clickService.create).toHaveBeenCalledWith({
        urlId: 1,
        userId: 1,
      });
    });
  });

  describe('onActive', () => {
    it('should log job active status', () => {
      const loggerSpy = jest.spyOn(clickConsumer['logger'], 'log');
      clickConsumer.onActive(mockJob);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Job ${mockJob.id} in queue ${CLICK_QUEUE} is now active`,
      );
    });
  });

  describe('onComplete', () => {
    it('should log job completion status', () => {
      const loggerSpy = jest.spyOn(clickConsumer['logger'], 'log');
      clickConsumer.onComplete(mockJob);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Job ${mockJob.id} in queue ${CLICK_QUEUE} has been completed`,
      );
    });
  });
});
