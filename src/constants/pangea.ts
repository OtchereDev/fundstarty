import { PangeaConfig } from 'pangea-node-sdk'

export const AUTHN_TOKEN = process.env.NEXT_AUTHN_TOKEN ?? ''

export default new PangeaConfig({ domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN })
