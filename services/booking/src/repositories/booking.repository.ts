import { Booking, PrismaClient } from '@prisma/client';
import {
  BookingPayload,
  BookingRepoInterface,
} from '../interfaces/booking.interface';

export class BookingRepository implements BookingRepoInterface {
  _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }
  async createBooking(booking: BookingPayload): Promise<Booking> {
    return await this._prisma.booking.create({ data: booking });
  }
  async getBookingById(id: string): Promise<Booking | null> {
    return await this._prisma.booking.findUnique({ where: { id } });
  }
  async getAllBookings(
    limit: number,
    page: number
  ): Promise<{ bookings: Booking[]; page: number; totalPages: number }> {
    const bookings = await this._prisma.booking.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });
    const totalBookings = await this._prisma.booking.count();
    return {
      bookings,
      page,
      totalPages: Math.ceil(totalBookings / limit),
    };
  }
  async getBookingByUserId(userId: string): Promise<Booking[]> {
    return await this._prisma.booking.findMany({
      where: {
        OR: [{ expertId: userId }, { playerId: userId }],
      },
    });
  }
  async updateBooking(
    id: string,
    booking: Partial<BookingPayload>
  ): Promise<Booking | null> {
    return await this._prisma.booking.update({ where: { id }, data: booking });
  }
  async deleteBooking(id: string): Promise<Booking | null> {
    return await this._prisma.booking.delete({ where: { id } });
  }
}
