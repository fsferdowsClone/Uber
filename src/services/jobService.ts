export type JobType = 'Full-time' | 'Part-time' | 'One-time' | 'Regular';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  posterName: string;
  status: "open" | "assigned" | "completed";
  budget: number;
  type: JobType;
  requirements: string[];
  createdAt: number;
}

const mockJobs: Job[] = [
  { 
    id: "1", 
    title: "Premium Delivery Driver", 
    description: "Need a driver for high-value tech deliveries in Dhaka. Requires a clean record and luxury vehicle handling experience.", 
    category: "Logistics", 
    area: "Dhaka, BD", 
    posterName: "Ferdows S.", 
    status: "open", 
    budget: 1500,
    type: 'Part-time',
    requirements: ['Valid License', 'Clean Record', 'Own Vehicle'],
    createdAt: Date.now() - 86400000
  },
  { 
    id: "2", 
    title: "Executive Protection", 
    description: "Security detail needed for visiting delegates. Professional attire and military/police background preferred.", 
    category: "Security", 
    area: "Gulshan, Dhaka", 
    posterName: "Ahmed R.", 
    status: "open", 
    budget: 5000,
    type: 'One-time',
    requirements: ['Experience in Security', 'Discreet', 'Physical Fitness'],
    createdAt: Date.now() - 3600000
  },
  { 
    id: "3", 
    title: "Corporate Fleet Manager", 
    description: "Oversee the logistics of our premium car fleet. Coordination and scheduling experience necessary.", 
    category: "Management", 
    area: "Banani, Dhaka", 
    posterName: "M. Khan", 
    status: "open", 
    budget: 45000,
    type: 'Full-time',
    requirements: ['Logistics Degree', '3+ Years Experience', 'MS Excel'],
    createdAt: Date.now() - 172800000
  },
];

class JobService {
  private jobs: Job[] = mockJobs;
  private listeners: ((jobs: Job[]) => void)[] = [];

  constructor() {
    const saved = localStorage.getItem('uber_premium_jobs');
    if (saved) {
      try {
        this.jobs = JSON.parse(saved);
      } catch (e) {
        this.jobs = mockJobs;
      }
    }
  }

  private notify() {
    this.listeners.forEach(l => l([...this.jobs]));
    localStorage.setItem('uber_premium_jobs', JSON.stringify(this.jobs));
  }

  subscribe(listener: (jobs: Job[]) => void) {
    this.listeners.push(listener);
    listener([...this.jobs]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addJob(job: Omit<Job, 'id' | 'status' | 'createdAt'>) {
    const newJob: Job = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      status: 'open',
      createdAt: Date.now(),
    };
    this.jobs = [newJob, ...this.jobs];
    this.notify();
    return newJob;
  }

  assignJob(jobId: string) {
    this.jobs = this.jobs.map(j => 
      j.id === jobId ? { ...j, status: 'assigned' as const } : j
    );
    this.notify();
  }
}

export const jobService = new JobService();
