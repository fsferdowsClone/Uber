import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, User, Clock, CheckCircle, ArrowRight, Shield, Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { rideService, RideRequest } from "@/services/rideService";
import { toast } from "sonner";
import { Map } from "@/components/Map";

export function DriverDashboard() {
  const [requests, setRequests] = React.useState<RideRequest[]>([]);
  const [activeRide, setActiveRide] = React.useState<RideRequest | null>(null);
  const [tripStage, setTripStage] = React.useState<'pickup' | 'destination' | 'completed'>('pickup');

  React.useEffect(() => {
    return rideService.subscribe((allRequests) => {
      const pending = allRequests.filter(r => r.status === 'pending');
      setRequests(pending);
      
      const active = allRequests.find(r => r.status === 'accepted'); 
      if (active) {
        setActiveRide(active);
        if (!activeRide) setTripStage('pickup');
      } else {
        setActiveRide(null);
      }
    });
  }, [activeRide]);

  const handleAccept = (rideId: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          rideService.acceptRequest(rideId, "driver_123");
          setTripStage('pickup');
          resolve(true);
        }, 1500);
      }),
      {
        loading: 'Securing the trip...',
        success: 'Ride accepted! Navigating to rider location.',
        error: 'Failed to accept ride.',
      }
    );
  };

  const handleNextStage = () => {
    if (tripStage === 'pickup') {
      setTripStage('destination');
      toast.success("Rider picked up! Heading to destination.");
    } else {
      toast.success("Trip completed! Safe travels.");
      rideService.clear();
      setTripStage('pickup');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Requests */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tighter">Driver Dashboard</h1>
            <p className="text-gray-500 text-sm">Real-time ride opportunities near you.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-black/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Incoming Requests ({requests.length})
            </h2>

            <AnimatePresence mode="popLayout">
              {requests.length === 0 && !activeRide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center space-y-4 bg-white rounded-[2rem] border border-black/[0.03]"
                >
                  <Navigation className="w-12 h-12 mx-auto text-black/5" />
                  <p className="text-gray-400 font-medium">Waiting for riders...</p>
                </motion.div>
              )}

              {activeRide && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full inline-block">
                    Current Trip
                  </div>
                  <Card className="glass-card border-black rounded-[2rem] shadow-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{activeRide.riderName}</span>
                        </div>
                        <span className="text-emerald-500">Active</span>
                      </div>
                      
                      <div className="space-y-4 relative">
                        <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-black/5" />
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-4 shrink-0 mt-1 transition-all",
                            tripStage === 'pickup' ? "bg-black border-white shadow-[0_0_0_2px_black] animate-pulse" : "bg-black/10 border-gray-100"
                          )} />
                          <div className={cn("space-y-0.5", tripStage !== 'pickup' && "opacity-40")}>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Pickup</p>
                            <p className="text-sm font-bold">{activeRide.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-5 h-5 rounded-sm border-4 shrink-0 mt-1 transition-all",
                            tripStage === 'destination' ? "bg-black border-white shadow-[0_0_0_2px_black] animate-pulse" : "bg-black/10 border-gray-100"
                          )} />
                          <div className={cn("space-y-0.5", tripStage !== 'destination' && "opacity-40")}>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Destination</p>
                            <p className="text-sm font-bold">{activeRide.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="rounded-xl h-12 font-bold gap-2 border-black/5 hover:bg-black hover:text-white transition-all">
                          <MessageSquare className="w-4 h-4" /> Chat
                        </Button>
                        <Button variant="outline" className="rounded-xl h-12 font-bold gap-2 border-black/5 hover:bg-black hover:text-white transition-all">
                          <Phone className="w-4 h-4" /> Call
                        </Button>
                      </div>

                      <Button 
                        onClick={handleNextStage}
                        className={cn(
                          "w-full h-14 font-bold rounded-xl shadow-xl transition-all",
                          tripStage === 'pickup' ? "bg-black text-white hover:bg-zinc-800" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        )}
                      >
                        {tripStage === 'pickup' ? "Confirm Pickup" : "Complete Trip"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {requests.map((ride, idx) => (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card border-white/40 rounded-[2rem] hover:shadow-xl transition-all overflow-hidden group">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="px-2 py-1 bg-black/5 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                              {ride.vehicleType}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                              <Clock className="w-3 h-3" /> 2m away
                            </div>
                          </div>
                          <h3 className="font-bold text-lg">{ride.riderName}</h3>
                        </div>
                        <p className="text-xl font-bold tracking-tighter">৳{ride.price}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-600">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <Navigation className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-600">{ride.destination}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleAccept(ride.id)}
                        className="w-full h-12 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold group"
                      >
                        Accept Ride
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-8 h-[600px] lg:h-auto lg:min-h-[80vh] relative rounded-[3rem] overflow-hidden border border-black/[0.05] shadow-2xl">
          <Map 
            tripStage={tripStage}
            routePoints={activeRide ? {
              pickup: activeRide.pickupCoords,
              destination: activeRide.destinationCoords
            } : undefined}
          />
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-2xl pointer-events-auto max-w-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black/5">
                    <img src="https://picsum.photos/seed/driver/100/100" alt="Driver" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-bold">Ferdows (Pro Driver)</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                      <Shield className="w-3 h-3" /> Verified Partner
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Rating</p>
                    <p className="font-bold">4.98 ★</p>
                  </div>
                  <div className="p-3 bg-black/5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Trips</p>
                    <p className="font-bold">1,240</p>
                  </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 items-end pointer-events-auto">
               <Button className="w-14 h-14 rounded-full bg-black text-white shadow-2xl luxury-shadow flex items-center justify-center p-0">
                  <Navigation className="w-6 h-6" />
               </Button>
               <div className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                  System Active
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
