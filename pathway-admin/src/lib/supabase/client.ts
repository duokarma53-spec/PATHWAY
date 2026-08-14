import { createBrowserClient } from '@supabase/ssr'

// Mock query builder that safely handles chained Supabase calls
function createMockQuery(): any {
  const mockPromise = Promise.resolve({ data: [], error: null, count: 0 });
  
  const proxy = new Proxy(() => {}, {
    get(target, prop) {
      if (prop === 'then') return mockPromise.then.bind(mockPromise);
      if (prop === 'catch') return mockPromise.catch.bind(mockPromise);
      if (prop === 'finally') return mockPromise.finally.bind(mockPromise);
      if (typeof prop === 'symbol') return undefined;
      return createMockQuery;
    },
    apply() {
      return createMockQuery;
    }
  });
  return proxy;
}

export function createClient() {
  // FORCE MOCK CLIENT FOR DEMO: By returning the mock client unconditionally, 
  // we bypass any fetch errors caused by the dummy .env.local file.
  return {
    from: () => createMockQuery(),
    auth: {
      getUser: async () => ({ data: { user: { id: '1', email: 'admin@pathway.demo' } }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null })
    }
  } as any;
}
