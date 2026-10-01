import type { AuthRole } from '@/types'

export const getDashboardRouteByRole = (role?: AuthRole | null) => {
  if (role === 'professional') {
    return { name: 'ProfessionalDashboard' }
  }

  return { name: 'ClientDashboard' }
}
