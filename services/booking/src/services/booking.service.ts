import { Booking } from '@prisma/client';
import {
  BookingPayload,
  BookingRepoInterface,
} from '../interfaces/booking.interface';

export class BookingService {
  private _repo: BookingRepoInterface;
  constructor(private repo: BookingRepoInterface) {
    this._repo = repo;
  }

  async createBooking(booking: BookingPayload): Promise<Booking> {
    return await this._repo.createBooking(booking);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return await this._repo.getBookingById(id);
  }

  async getAllBookings(
    limit: number,
    page: number
  ): Promise<{ bookings: Booking[]; page: number; totalPages: number }> {
    return await this._repo.getAllBookings(limit, page);
  }

  async getBookingByUserId(userId: string): Promise<Booking[]> {
    return await this._repo.getBookingByUserId(userId);
  }

  async updateBooking(
    id: string,
    booking: Partial<BookingPayload>
  ): Promise<Booking | null> {
    return await this._repo.updateBooking(id, booking);
  }

  async deleteBooking(id: string): Promise<Booking | null> {
    return await this._repo.deleteBooking(id);
  }
}
