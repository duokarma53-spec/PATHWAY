

// Rich dummy data for demo purposes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DUMMY_DATA: Record<string, any[]> = {
  leads: [
    { id: 1, first_name: 'Rahul', last_name: 'Sharma', email: 'rahul.s@example.com', status: 'new', inquiry_type: 'general', created_at: new Date().toISOString() },
    { id: 2, first_name: 'Priya', last_name: 'Patel', email: 'priya.p@example.com', status: 'contacted', inquiry_type: 'university_application', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, first_name: 'Amit', last_name: 'Singh', email: 'amit.singh@example.com', status: 'converted', inquiry_type: 'visa_assistance', created_at: new Date(Date.now() - 172800000).toISOString() },
  ],
  consultations: [
    { id: 1, name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 98765 43210", preferred_date: new Date().toISOString(), preferred_time: "10:00", status: "pending" },
    { id: 2, name: "Priya Patel", email: "priya.p@example.com", phone: "+91 98765 43211", preferred_date: new Date().toISOString(), preferred_time: "14:30", status: "confirmed" }
  ],
  destinations: [
    { id: 1, name: 'United States', slug: 'us', status: 'active', created_at: new Date().toISOString() },
    { id: 2, name: 'United Kingdom', slug: 'uk', status: 'active', created_at: new Date().toISOString() },
    { id: 3, name: 'Canada', slug: 'canada', status: 'active', created_at: new Date().toISOString() },
    { id: 4, name: 'Australia', slug: 'australia', status: 'active', created_at: new Date().toISOString() }
  ],
  students: [
    { id: 1, first_name: 'Aman', last_name: 'Gupta', email: 'aman.g@example.com', application_status: 'in_progress', created_at: new Date().toISOString() },
    { id: 2, first_name: 'Sneha', last_name: 'Reddy', email: 'sneha.r@example.com', application_status: 'enrolled', created_at: new Date().toISOString() }
  ],
  applications: [
    { id: 1, student_id: 1, university_name: 'Stanford University', program_name: 'MS Computer Science', status: 'submitted', created_at: new Date().toISOString() },
    { id: 2, student_id: 2, university_name: 'University of Oxford', program_name: 'MBA', status: 'offer', created_at: new Date().toISOString() }
  ],
  universities: [
    { id: 1, name: 'Stanford University', country: 'United States', status: 'active' },
    { id: 2, name: 'University of Oxford', country: 'United Kingdom', status: 'active' }
  ],
  services: [
    { id: 1, name: 'University Admissions', type: 'core', status: 'active' },
    { id: 2, name: 'Visa Assistance', type: 'addon', status: 'active' }
  ]
};

// Mock query builder that safely handles chained Supabase calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockQuery(table?: string): any {
  const data = table && DUMMY_DATA[table] ? DUMMY_DATA[table] : [];
  const mockPromise = Promise.resolve({ data, error: null, count: data.length });
  
  const proxy = new Proxy(() => {}, {
    get(target, prop) {
      if (prop === 'then') return mockPromise.then.bind(mockPromise);
      if (prop === 'catch') return mockPromise.catch.bind(mockPromise);
      if (prop === 'finally') return mockPromise.finally.bind(mockPromise);
      if (typeof prop === 'symbol') return undefined;
      return createMockQuery(table);
    },
    apply() {
      return createMockQuery(table);
    }
  });
  return proxy;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createClient(): Promise<any> {
  // FORCE MOCK CLIENT FOR DEMO: By returning the mock client unconditionally, 
  // we bypass any fetch errors caused by the dummy .env.local file.
  return {
    from: (table: string) => createMockQuery(table),
    auth: {
      getUser: async () => ({ data: { user: { id: '1', email: 'admin@pathway.demo' } }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null })
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
