import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomWithSeatsDto } from './dto/create-room-with-seats.dto';

@ApiTags('rooms')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('/api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateRoomDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'List of all rooms' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @ApiOperation({ summary: 'Get all active rooms' })
  @ApiResponse({ status: 200, description: 'List of active rooms' })
  @Get('active')
  findActive() {
    return this.roomsService.findActive();
  }

  @ApiOperation({ summary: 'Search rooms by term' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiQuery({ name: 'q', description: 'Search term' })
  @Get('search')
  searchRooms(@Query('q') searchTerm: string) {
    return this.roomsService.searchRooms(searchTerm);
  }

  @ApiOperation({ summary: 'Get room statistics' })
  @ApiResponse({ status: 200, description: 'Room statistics' })
  @Get('stats')
  getRoomStats() {
    return this.roomsService.getRoomStats();
  }

  @ApiOperation({ summary: 'Get rooms by type' })
  @ApiResponse({ status: 200, description: 'List of rooms by type' })
  @ApiParam({ name: 'roomType', description: 'Room type' })
  @Get('type/:roomType')
  findByType(@Param('roomType') roomType: string) {
    return this.roomsService.findByType(roomType);
  }

  @ApiOperation({ summary: 'Get rooms by floor' })
  @ApiResponse({ status: 200, description: 'List of rooms by floor' })
  @ApiParam({ name: 'floor', description: 'Floor number' })
  @Get('floor/:floor')
  findByFloor(@Param('floor', ParseIntPipe) floor: number) {
    return this.roomsService.findByFloor(floor);
  }

  @ApiOperation({ summary: 'Get rooms by capacity range' })
  @ApiResponse({ status: 200, description: 'List of rooms by capacity range' })
  @ApiQuery({ name: 'min', description: 'Minimum capacity' })
  @ApiQuery({ name: 'max', description: 'Maximum capacity' })
  @Get('capacity-range')
  findByCapacityRange(
    @Query('min', ParseIntPipe) minCapacity: number,
    @Query('max', ParseIntPipe) maxCapacity: number,
  ) {
    return this.roomsService.findByCapacityRange(minCapacity, maxCapacity);
  }

  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({ status: 200, description: 'Room found' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a room' })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiBody({ type: UpdateRoomDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @ApiOperation({ summary: 'Toggle room status' })
  @ApiResponse({ status: 200, description: 'Room status toggled' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.toggleStatus(id);
  }

  @ApiOperation({ summary: 'Bulk update room status' })
  @ApiResponse({ status: 200, description: 'Rooms status updated' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'number' } },
        isActive: { type: 'boolean' },
      },
    },
  })
  @Patch('bulk/status')
  bulkUpdateStatus(@Body() bulkData: { ids: number[]; isActive: boolean }) {
    return this.roomsService.bulkUpdateStatus(bulkData.ids, bulkData.isActive);
  }

  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 204, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }

  @ApiOperation({ summary: 'Create a room with standard seat layout' })
  @ApiResponse({
    status: 201,
    description: 'Room with seats created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateRoomWithSeatsDto })
  @Post('with-standard-seats')
  @HttpCode(HttpStatus.CREATED)
  createWithStandardSeats(@Body() roomData: CreateRoomWithSeatsDto) {
    const {
      rows = ['A', 'B', 'C', 'D', 'E', 'F'],
      seatsPerRow = 10,
      ...createRoomDto
    } = roomData;
    return this.roomsService.createRoomWithStandardSeats(
      createRoomDto,
      rows,
      seatsPerRow,
    );
  }

  @ApiOperation({ summary: 'Get a room with its seats' })
  @ApiResponse({ status: 200, description: 'Room with seats found' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @Get(':id/with-seats')
  findOneWithSeats(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOneWithSeats(id);
  }
}
