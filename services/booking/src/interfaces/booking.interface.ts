import { Booking } from '@prisma/client';

export type BookingPayload = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
export interface BookingRepoInterface {
  createBooking(booking: BookingPayload): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | null>;
  getAllBookings(
    limit: number,
    page: number
  ): Promise<{ bookings: Booking[]; page: number; totalPages: number }>;
  getBookingByUserId(userId: string): Promise<Booking[]>;
  updateBooking(
    id: string,
    booking: Partial<BookingPayload>
  ): Promise<Booking | null>;
  deleteBooking(id: string): Promise<Booking | null>;
}
