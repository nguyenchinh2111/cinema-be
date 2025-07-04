import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import {
  Voucher,
  VoucherStatus,
  VoucherType,
  DiscountScope,
} from './entities/voucher.entity';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    // Check if voucher code already exists
    const existingVoucher = await this.vouchersRepository.findOne({
      where: { code: createVoucherDto.code },
    });

    if (existingVoucher) {
      throw new ConflictException('Voucher code already exists');
    }

    const voucher = this.vouchersRepository.create(createVoucherDto);
    return this.vouchersRepository.save(voucher);
  }

  async findAll(): Promise<Voucher[]> {
    return this.vouchersRepository.find({
      relations: ['applicableMovie'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Voucher[]> {
    const now = new Date();
    return this.vouchersRepository.find({
      where: {
        status: VoucherStatus.ACTIVE,
        isActive: true,
        validFrom: LessThanOrEqual(now),
        validUntil: MoreThanOrEqual(now),
      },
      relations: ['applicableMovie'],
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByCode(code: string): Promise<Voucher> {
    const voucher = await this.vouchersRepository.findOne({
      where: { code },
      relations: ['applicableMovie'],
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${code} not found`);
    }

    return voucher;
  }

  async findOne(id: number): Promise<Voucher> {
    const voucher = await this.vouchersRepository.findOne({
      where: { id },
      relations: ['applicableMovie'],
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }

    return voucher;
  }

  async findByMovieId(movieId: number): Promise<Voucher[]> {
    const now = new Date();
    return this.vouchersRepository.find({
      where: [
        {
          applicableMovieId: movieId,
          status: VoucherStatus.ACTIVE,
          isActive: true,
          validFrom: LessThanOrEqual(now),
          validUntil: MoreThanOrEqual(now),
        },
        {
          discountScope: DiscountScope.ALL_MOVIES,
          status: VoucherStatus.ACTIVE,
          isActive: true,
          validFrom: LessThanOrEqual(now),
          validUntil: MoreThanOrEqual(now),
        },
      ],
      relations: ['applicableMovie'],
      order: { priority: 'DESC' },
    });
  }

  async validateVoucher(
    code: string,
    movieId?: number,
    orderAmount?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    customerEmail?: string,
  ): Promise<{
    isValid: boolean;
    voucher?: Voucher;
    error?: string;
    discountAmount?: number;
  }> {
    try {
      const voucher = await this.findByCode(code);
      const now = new Date();

      // Check if voucher is active
      if (voucher.status !== VoucherStatus.ACTIVE || !voucher.isActive) {
        return { isValid: false, error: 'Voucher is not active' };
      }

      // Check date validity
      if (voucher.validFrom > now || voucher.validUntil < now) {
        return {
          isValid: false,
          error: 'Voucher has expired or not yet valid',
        };
      }

      // Check usage limits
      if (voucher.maxUsage && voucher.currentUsage >= voucher.maxUsage) {
        return { isValid: false, error: 'Voucher usage limit exceeded' };
      }

      // Check minimum order amount
      if (
        voucher.minOrderAmount &&
        orderAmount &&
        orderAmount < voucher.minOrderAmount
      ) {
        return {
          isValid: false,
          error: `Minimum order amount is ${voucher.minOrderAmount}`,
        };
      }

      // Check movie applicability
      if (movieId && voucher.discountScope === DiscountScope.SPECIFIC_MOVIE) {
        if (voucher.applicableMovieId !== movieId) {
          return {
            isValid: false,
            error: 'Voucher not applicable to this movie',
          };
        }
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (orderAmount) {
        if (
          voucher.voucherType === VoucherType.PERCENTAGE &&
          voucher.discountPercent
        ) {
          discountAmount = (orderAmount * voucher.discountPercent) / 100;
          if (
            voucher.maxDiscountAmount &&
            discountAmount > voucher.maxDiscountAmount
          ) {
            discountAmount = voucher.maxDiscountAmount;
          }
        } else if (
          voucher.voucherType === VoucherType.FIXED_AMOUNT &&
          voucher.discountValue
        ) {
          discountAmount = Math.min(voucher.discountValue, orderAmount);
        }
      }

      return {
        isValid: true,
        voucher,
        discountAmount,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { isValid: false, error: 'Invalid voucher code' };
    }
  }

  async applyVoucher(code: string): Promise<Voucher> {
    const voucher = await this.findByCode(code);

    if (voucher.maxUsage && voucher.currentUsage >= voucher.maxUsage) {
      throw new BadRequestException('Voucher usage limit exceeded');
    }

    voucher.currentUsage += 1;

    if (voucher.maxUsage && voucher.currentUsage >= voucher.maxUsage) {
      voucher.status = VoucherStatus.USED_UP;
    }

    return this.vouchersRepository.save(voucher);
  }

  async update(
    id: number,
    updateVoucherDto: UpdateVoucherDto,
  ): Promise<Voucher> {
    const voucher = await this.findOne(id);
    Object.assign(voucher, updateVoucherDto);
    return this.vouchersRepository.save(voucher);
  }

  async deactivate(id: number): Promise<Voucher> {
    const voucher = await this.findOne(id);
    voucher.status = VoucherStatus.INACTIVE;
    voucher.isActive = false;
    return this.vouchersRepository.save(voucher);
  }

  async remove(id: number): Promise<void> {
    const voucher = await this.findOne(id);
    await this.vouchersRepository.remove(voucher);
  }

  async getUsageStats(startDate?: Date, endDate?: Date) {
    const whereClause =
      startDate && endDate ? { createdAt: Between(startDate, endDate) } : {};

    const [totalVouchers, activeVouchers, usedVouchers] = await Promise.all([
      this.vouchersRepository.count({ where: whereClause }),
      this.vouchersRepository.count({
        where: { ...whereClause, status: VoucherStatus.ACTIVE },
      }),
      this.vouchersRepository.count({
        where: { ...whereClause, status: VoucherStatus.USED_UP },
      }),
    ]);

    return {
      totalVouchers,
      activeVouchers,
      usedVouchers,
    };
  }

  async findExpiring(days: number = 7): Promise<Voucher[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.vouchersRepository.find({
      where: {
        status: VoucherStatus.ACTIVE,
        validUntil: LessThanOrEqual(futureDate),
      },
      relations: ['applicableMovie'],
      order: { validUntil: 'ASC' },
    });
  }
}
