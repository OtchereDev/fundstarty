import { FundInvestment, Fundraiser } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateRaised = (fundraiser: Fundraiser & { investments: FundInvestment[] }) => {
  return fundraiser.investments.reduce((prev, curr) => {
    return prev + parseFloat(curr.amount.toString())
  }, 0)
}
