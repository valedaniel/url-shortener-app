import { Logger } from '@nestjs/common';

export function handleError(error: any, logger: Logger, message: string) {
  if (error instanceof Error) {
    logger.error(message, { error });
  }
}
