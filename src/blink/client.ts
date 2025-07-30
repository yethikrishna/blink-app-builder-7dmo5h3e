import { createClient as createBlinkClient } from '@blinkdotnew/sdk'

export const blink = createBlinkClient({
  projectId: 'blink-app-builder-7dmo5h3e',
  authRequired: false
})

export const createClient = () => blink

export default blink