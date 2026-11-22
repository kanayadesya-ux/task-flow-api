import {
  IPaginatedResult,
  IPaginationQuery,
} from '../../utils/pagination.util';

import { EventStatus } from '../enums/event-status.enum';

import {
  ICreateEventInput,
  IEvent,
  IUpdateEventInput,
} from './event.interface';

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

export type EventSortField =
  'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'name' | 'status';

export interface IEventPaginationQuery extends IPaginationQuery {
  status?: EventStatus;
  search?: string;
  sortBy?: EventSortField;
}

export interface IEventRepository {
  findAll(status?: EventStatus): Promise<IEvent[]>;

  findPaginated(
    query?: IEventPaginationQuery,
  ): Promise<IPaginatedResult<IEvent>>;

  findById(id: string): Promise<IEvent | null>;

  create(data: ICreateEventInput): Promise<IEvent>;

  update(id: string, data: IUpdateEventInput): Promise<IEvent | null>;

  updateStatus(id: string, status: EventStatus): Promise<IEvent | null>;

  remove(id: string): Promise<boolean>;
}
