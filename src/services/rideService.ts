import { toast } from "sonner";

export interface RideRequest {
  id: string;
  pickup: string;
  destination: string;
  pickupCoords: [number, number];
  destinationCoords: [number, number];
  vehicleType: string;
  price: number;
  status: 'pending' | 'accepted' | 'completed';
  timestamp: number;
  riderName: string;
  driverId?: string;
}

class RideService {
  private requests: RideRequest[] = [];
  private listeners: ((requests: RideRequest[]) => void)[] = [];

  constructor() {
    // Load from localStorage for persistence in this session
    const saved = localStorage.getItem('uber_premium_ride_requests');
    if (saved) {
      try {
        this.requests = JSON.parse(saved);
      } catch (e) {
        this.requests = [];
      }
    }
  }

  private notify() {
    this.listeners.forEach(l => l([...this.requests]));
    localStorage.setItem('uber_premium_ride_requests', JSON.stringify(this.requests));
  }

  subscribe(listener: (requests: RideRequest[]) => void) {
    this.listeners.push(listener);
    listener([...this.requests]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addRequest(request: Omit<RideRequest, 'id' | 'status' | 'timestamp'>) {
    const newRequest: RideRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      timestamp: Date.now(),
    };
    this.requests = [newRequest, ...this.requests];
    this.notify();
    return newRequest;
  }

  acceptRequest(requestId: string, driverId: string) {
    this.requests = this.requests.map(r => 
      r.id === requestId ? { ...r, status: 'accepted', driverId } : r
    );
    this.notify();
  }

  getRequests() {
    return [...this.requests];
  }

  clear() {
    this.requests = [];
    this.notify();
  }
}

export const rideService = new RideService();
