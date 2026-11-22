import { IBaseEntity } from './base-entity.interface';
import { IEvent } from './event.interface';

export interface IParticipant extends IBaseEntity {
  name: string;
  email: string;
  phone: string;
  event: IEvent;
}

export interface ICreateParticipantInput {
  name: string;
  email: string;
  phone: string;
  eventId: string;
}

export type IUpdateParticipantInput = Partial<
  Omit<ICreateParticipantInput, 'eventId'>
> & {
  eventId?: string;
};
