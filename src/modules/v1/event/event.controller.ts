import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateEventDto,
  FindAllEventsQueryDto,
  UpdateEventDto,
  UpdateEventStatusDto,
} from './dto';

import { EventService } from './event.service';

@Controller('v1/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(@Query() query: FindAllEventsQueryDto) {
    const result = await this.eventService.findAll(query);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Events retrieved successfully',
      data: result.items,
      meta: result.meta,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const event = await this.eventService.findById(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event retrieved successfully',
      data: event,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateEventDto) {
    const event = await this.eventService.create({
      name: body.name,
      description: body.description,
      location: body.location,
      status: body.status,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Event created successfully',
      data: event,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventDto,
  ) {
    const event = await this.eventService.update(id, {
      name: body.name,
      description: body.description,
      location: body.location,
      status: body.status,
      startDate:
        body.startDate !== undefined ? new Date(body.startDate) : undefined,
      endDate: body.endDate !== undefined ? new Date(body.endDate) : undefined,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event updated successfully',
      data: event,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventStatusDto,
  ) {
    const event = await this.eventService.updateStatus(id, body.status);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event status updated successfully',
      data: event,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.eventService.remove(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event deleted successfully',
      data,
    };
  }
}
