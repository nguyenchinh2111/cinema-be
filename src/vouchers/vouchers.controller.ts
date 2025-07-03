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
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@ApiTags('vouchers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('/api/vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiResponse({ status: 201, description: 'Voucher created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateVoucherDto })
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({ status: 200, description: 'List of all vouchers' })
  @Get()
  findAll() {
    return this.vouchersService.findAll();
  }

  @ApiOperation({ summary: 'Get active vouchers' })
  @ApiResponse({ status: 200, description: 'List of active vouchers' })
  @Get('active')
  findActive() {
    return this.vouchersService.findActive();
  }

  @ApiOperation({ summary: 'Get voucher usage statistics' })
  @ApiResponse({ status: 200, description: 'Voucher usage statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date' })
  @Get('stats')
  getUsageStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.vouchersService.getUsageStats(start, end);
  }

  @ApiOperation({ summary: 'Get expiring vouchers' })
  @ApiResponse({ status: 200, description: 'List of expiring vouchers' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Days until expiration',
  })
  @Get('expiring')
  findExpiring(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.vouchersService.findExpiring(daysNum);
  }

  @ApiOperation({ summary: 'Get voucher by code' })
  @ApiResponse({ status: 200, description: 'Voucher found' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'code', description: 'Voucher code' })
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.vouchersService.findByCode(code);
  }

  @ApiOperation({ summary: 'Get vouchers by movie ID' })
  @ApiResponse({ status: 200, description: 'List of vouchers for movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID' })
  @Get('movie/:movieId')
  findByMovieId(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.vouchersService.findByMovieId(movieId);
  }

  @ApiOperation({ summary: 'Validate a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher validation result' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'code', description: 'Voucher code' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        movieId: { type: 'number' },
        orderAmount: { type: 'number' },
        customerEmail: { type: 'string' },
      },
    },
  })
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

  @ApiOperation({ summary: 'Apply a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher applied successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'code', description: 'Voucher code' })
  @Post('apply/:code')
  applyVoucher(@Param('code') code: string) {
    return this.vouchersService.applyVoucher(code);
  }

  @ApiOperation({ summary: 'Get a voucher by ID' })
  @ApiResponse({ status: 200, description: 'Voucher found' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'id', description: 'Voucher ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher updated successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'id', description: 'Voucher ID' })
  @ApiBody({ type: UpdateVoucherDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.vouchersService.update(id, updateVoucherDto);
  }

  @ApiOperation({ summary: 'Deactivate a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher deactivated' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'id', description: 'Voucher ID' })
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.deactivate(id);
  }

  @ApiOperation({ summary: 'Delete a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  @ApiParam({ name: 'id', description: 'Voucher ID' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.remove(id);
  }
}
