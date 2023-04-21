import { object, string, nativeEnum, TypeOf } from 'zod';
import LogType from '../types/logType.type';

export const createLogSchema = object({
  body: object({
    requestUserId: string({
      required_error: 'Id is Required',
    }),
    action: nativeEnum(LogType),
    description: string({
      required_error: 'Description is Required',
    }),
    payload: string({}).optional(),
  }),
});

export type CreateLogInput = TypeOf<typeof createLogSchema>['body'];
