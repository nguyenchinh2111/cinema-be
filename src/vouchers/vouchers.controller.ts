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
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller('/api/vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get()
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get('active')
  findActive() {
    return this.vouchersService.findActive();
  }

  @Get('stats')
  getUsageStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.vouchersService.getUsageStats(start, end);
  }

  @Get('expiring')
  findExpiring(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.vouchersService.findExpiring(daysNum);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.vouchersService.findByCode(code);
  }

  @Get('movie/:movieId')
  findByMovieId(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.vouchersService.findByMovieId(movieId);
  }

  @Post('validate/:code')
  validateVoucher(
    @Param('code') code: string,
    @Body()
    validationData: {
      movieId?: number;
      orderAmount?: number;
      customerEmail?: string;
    },
  ) {
    return this.vouchersService.validateVoucher(
      code,
      validationData.movieId,
      validationData.orderAmount,
      validationData.customerEmail,
    );
  }

  @Post('apply/:code')
  applyVoucher(@Param('code') code: string) {
    return this.vouchersService.applyVoucher(code);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.vouchersService.update(id, updateVoucherDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.remove(id);
  }
}
