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
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('/api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.roomsService.findActive();
  }

  @Get('search')
  searchRooms(@Query('q') searchTerm: string) {
    return this.roomsService.searchRooms(searchTerm);
  }

  @Get('stats')
  getRoomStats() {
    return this.roomsService.getRoomStats();
  }

  @Get('type/:roomType')
  findByType(@Param('roomType') roomType: string) {
    return this.roomsService.findByType(roomType);
  }

  @Get('floor/:floor')
  findByFloor(@Param('floor', ParseIntPipe) floor: number) {
    return this.roomsService.findByFloor(floor);
  }

  @Get('capacity-range')
  findByCapacityRange(
    @Query('min', ParseIntPipe) minCapacity: number,
    @Query('max', ParseIntPipe) maxCapacity: number,
  ) {
    return this.roomsService.findByCapacityRange(minCapacity, maxCapacity);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.toggleStatus(id);
  }

  @Patch('bulk/status')
  bulkUpdateStatus(@Body() bulkData: { ids: number[]; isActive: boolean }) {
    return this.roomsService.bulkUpdateStatus(bulkData.ids, bulkData.isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
