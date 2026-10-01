import { request } from './axios'

export type BookingSummary = {
  id: number
  professional?: {
    id: number
    name?: string
  }
  client?: {
    id: number
    name?: string
  }
  service_description: string
  scheduled_date: string
  total: number | string
  status?: string
}

type BookingListResponse = {
  success: boolean
  data: BookingSummary[]
}

type BookingDetailResponse = {
  success: boolean
  data: BookingSummary
}

type BookingActionResponse = {
  success: boolean
  message?: string
}

export type CreateBookingPayload = {
  professional_id: number | string
  service_description: string
  scheduled_date: string
  total: number | string
}

export const createBooking = (payload: CreateBookingPayload) => {
  return request<BookingDetailResponse>('/bookings', {
    method: 'POST',
    body: payload,
  })
}

export const listBookings = () => {
  return request<BookingListResponse>('/bookings')
}

export const getBooking = (id: number | string) => {
  return request<BookingDetailResponse>(`/bookings/${id}`)
}

export const cancelBooking = (id: number | string) => {
  return request<BookingActionResponse>(`/bookings/${id}/cancel`, {
    method: 'POST',
  })
}
