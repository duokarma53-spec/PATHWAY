// In-memory Push Subscription store shared between subscribe and send endpoints
// (and optionally synced with Supabase for persistent multi-device delivery)
export const subscriptionsStore = new Map<string, any>();
