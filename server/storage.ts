export interface IStorage {
  // No storage needed for this accessibility checker
  // All scans are processed in real-time without persistence
}

export class MemStorage implements IStorage {
  constructor() {
    // No initialization needed
  }
}

export const storage = new MemStorage();
