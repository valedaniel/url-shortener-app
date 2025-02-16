import { IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNumberString(undefined, {
    message: 'ID must be a number',
  })
  id: number;
}
