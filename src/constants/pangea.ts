import { AuditService, PangeaConfig } from 'pangea-node-sdk'

export const AUTHN_TOKEN = process.env.NEXT_AUTHN_TOKEN ?? ''

const pangea = new PangeaConfig({ domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN })

// exporting secure audit instance from here to prevent repetitions
export const SecureAudut = new AuditService(process.env.NEXT_PANGEA_SECURE_AUDIT as string, pangea)

export default pangea
