import { BookingStatus } from "@/utils/enum"

/**
 * Checks if a booking should automatically transition from Finish to Complete
 * based on the 24-hour rule after completion
 */
export function shouldAutoTransitionToComplete(status: BookingStatus, timeEnd: string): boolean {
  if (status !== BookingStatus.Finish) {
    return false
  }

  const endTime = new Date(timeEnd)
  const now = new Date()
  const hoursSinceEnd = (now.getTime() - endTime.getTime()) / (1000 * 60 * 60)

  return hoursSinceEnd >= 24
}

/**
 * Gets the effective status, automatically transitioning Finish to Complete after 24 hours
 */
export function getEffectiveStatus(status: BookingStatus, timeEnd: string): BookingStatus {
  if (shouldAutoTransitionToComplete(status, timeEnd)) {
    return BookingStatus.Complete
  }
  return status
}

/**
 * Gets the time remaining until auto-transition to Complete status
 */
export function getTimeUntilAutoComplete(timeEnd: string): {
  hours: number
  minutes: number
  isExpired: boolean
} {
  const endTime = new Date(timeEnd)
  const autoCompleteTime = new Date(endTime.getTime() + 24 * 60 * 60 * 1000) // Add 24 hours
  const now = new Date()
  const msRemaining = autoCompleteTime.getTime() - now.getTime()

  if (msRemaining <= 0) {
    return { hours: 0, minutes: 0, isExpired: true }
  }

  const hours = Math.floor(msRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes, isExpired: false }
}
