import { createClient as createBlinkClient } from '@blinkdotnew/sdk'

export const kink = createBlinkClient({
  projectId: 'blink-app-builder-7dmo5h3e',
  authRequired: false
})

export const createClient = () => kink

export default kink