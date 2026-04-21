import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowRight, Car, Calendar, Package, X, Globe, MapPin, Navigation, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DriverRegistrationForm } from "./DriverRegistrationForm";
import { Map } from "./Map";
import * as React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { rideService } from "@/services/rideService";
import { Link } from "react-router-dom";

const CURRENCIES = [
  { code: "BDT", symbol: "৳", rate: 1 }, // Base currency for formula
  { code: "EUR", symbol: "€", rate: 0.0076 }, // Approx BDT to EUR
  { code: "USD", symbol: "$", rate: 0.0084 }, // Approx BDT to USD
];

const VEHICLE_TYPES = [
  { 
    id: "premier", 
    name: "Premier", 
    icon: Car, 
    base: 80, 
    perKm: 22, 
    perMin: 3, 
    desc: "Luxury cars with top-rated drivers",
    timeFactor: 1.5
  },
  { 
    id: "moto", 
    name: "UberMOTO", 
    icon: Navigation, 
    base: 30, 
    perKm: 12, 
    perMin: 0.5, 
    desc: "Quick, affordable motorbike rides",
    timeFactor: 1.2
  },
];

const LOCATIONS = [
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Bashundhara R/A, Dhaka",
  "Uttara, Dhaka",
  "Dhanmondi, Dhaka",
  "Shahbagh, Dhaka",
  "Motijheel, Dhaka",
  "Mirpur, Dhaka",
  "Puran Dhaka",
  "Airport Road, Dhaka"
];

export function Hero() {
  const [currency, setCurrency] = React.useState(CURRENCIES[0]);
  const [pickup, setPickup] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<{type: string, price: number, eta: number}[] | null>(null);
  const [selectedVehicle, setSelectedVehicle] = React.useState(VEHICLE_TYPES[0].id);
  const [routePoints, setRoutePoints] = React.useState<{pickup: [number, number] | null, destination: [number, number] | null}>({ pickup: null, destination: null });
  
  const [showPickupSuggestions, setShowPickupSuggestions] = React.useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);

  const fetchCurrentLocation = () => {
    if (!("geolocation" in navigator)) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you'd use a reverse geocoding API here.
        // For this premium demo, we'll use a descriptive string.
        setPickup("Current Location (Dhaka City)");
        setIsLocating(false);
      },
      (error) => {
        console.error("Error fetching location:", error.message || "Unknown error (check browser permissions)");
        setIsLocating(false);
      }
    );
  };

  const filteredPickupSuggestions = LOCATIONS.filter(l => l.toLowerCase().includes(pickup.toLowerCase()) && pickup.length > 0);
  const filteredDestSuggestions = LOCATIONS.filter(l => l.toLowerCase().includes(destination.toLowerCase()) && destination.length > 0);

  // Geolocation setup
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Current location:", position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const [isRequesting, setIsRequesting] = React.useState(false);
  const [activeRequest, setActiveRequest] = React.useState<any>(null);

  React.useEffect(() => {
    return rideService.subscribe((requests) => {
      // Find my request (for demo, assume one request from this rider)
      const myRequest = requests.find(r => r.riderName.includes("Ferdows"));
      setActiveRequest(myRequest || null);
      if (myRequest && myRequest.status === 'accepted') {
        setRoutePoints({ pickup: myRequest.pickupCoords, destination: myRequest.destinationCoords });
      }
    });
  }, []);

  const handleRequestRide = () => {
    if (!selectedVehicle || !routePoints.pickup || !routePoints.destination) return;
    setIsRequesting(true);
    
    rideService.addRequest({
      pickup,
      destination,
      pickupCoords: routePoints.pickup,
      destinationCoords: routePoints.destination,
      vehicleType: VEHICLE_TYPES.find(v => v.id === selectedVehicle)?.name || "Premier",
      price: searchResults?.find(r => r.type === selectedVehicle)?.price || 0,
      riderName: "Ferdows (Rider)"
    });

    toast.loading("Finding your driver...");
    
    setTimeout(() => {
      setIsRequesting(false);
      toast.dismiss();
      const vehicleName = VEHICLE_TYPES.find(v => v.id === selectedVehicle)?.name;
      toast.success("Request Sent!", {
        description: `Your ${vehicleName} request is live. Drivers can now see it.`,
      });
      setSearchResults(null);
      // Don't clear routePoints yet, let the subscription handle it or keep it for context
      setPickup("");
      setDestination("");
    }, 2000);
  };

  const calculatePrice = () => {
    if (!pickup || !destination) return;
    setIsSearching(true);
    setSearchResults(null);
    setShowPickupSuggestions(false);
    setShowDestSuggestions(false);
    
    // Simulated coordinates in Dhaka
    const dhakaCenter: [number, number] = [90.4125, 23.8103];
    const offset = () => (Math.random() - 0.5) * 0.1;
    const start: [number, number] = [dhakaCenter[0] + offset(), dhakaCenter[1] + offset()];
    const end: [number, number] = [dhakaCenter[0] + offset(), dhakaCenter[1] + offset()];

    setTimeout(() => {
      setRoutePoints({ pickup: start, destination: end });
      const distanceArr = Math.random() * 15 + 5;
      
      const results = VEHICLE_TYPES.map(vt => {
        const estimatedTime = distanceArr * vt.timeFactor;
        const priceInBDT = vt.base + (distanceArr * vt.perKm) + (estimatedTime * vt.perMin);
        return {
          type: vt.id,
          price: priceInBDT * currency.rate,
          eta: Math.round(estimatedTime)
        };
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Dynamic Map Background - Full Visibility */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <Map 
          routePoints={routePoints}
          className={cn(
            "transition-all duration-1000",
            "opacity-100 grayscale-0 scale-100"
          )} 
        />
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
          searchResults ? "bg-black/5" : "bg-black/10"
        )} />
      </div>

      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Active Request Overlay */}
        <AnimatePresence>
          {activeRequest && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-24 right-4 sm:right-12 z-20 pointer-events-auto"
            >
              <Card className="glass-card border-black/5 rounded-[2rem] w-80 overflow-hidden shadow-2xl">
                <div className="bg-black p-6 text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ride Status</p>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      activeRequest.status === 'pending' ? "bg-amber-400 text-black" : "bg-emerald-500 text-white"
                    )}>
                      {activeRequest.status}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold tracking-tighter">
                      {activeRequest.status === 'pending' ? "Finding Driver..." : "Driver En Route"}
                    </h4>
                    <p className="text-xs opacity-60">{activeRequest.vehicleType} • ৳{activeRequest.price}</p>
                  </div>
                </div>
                <CardContent className="p-6 bg-white space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{activeRequest.status === 'accepted' ? "Ferdows Driver" : "Searching..."}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Driver Identity</p>
                      </div>
                   </div>
                   {activeRequest.status === 'pending' && (
                     <Link to="/driver" className="block">
                        <Button variant="outline" className="w-full text-xs font-bold border-dashed border-black/10 h-10">
                           Simulate as Driver
                        </Button>
                     </Link>
                   )}
                   {activeRequest.status === 'accepted' && (
                     <Button 
                       onClick={() => rideService.clear()}
                       className="w-full h-12 bg-black text-white font-bold rounded-xl"
                     >
                       Cancel Ride
                     </Button>
                   )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-full flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto pb-8 sm:pb-0">
          <div className={cn(
            "space-y-8 transition-all duration-700 pointer-events-auto mt-auto sm:mt-0",
            searchResults ? "w-full max-w-md" : "w-full lg:max-w-xl xl:max-w-2xl"
          )}>
            <motion.div
              key="hero-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={cn(
                "space-y-4 sm:space-y-6 transition-all duration-700",
                searchResults ? "scale-75 sm:scale-90 origin-left" : "text-center sm:text-left"
              )}
            >
              <h1 className={cn(
                "font-bold tracking-tighter text-black leading-[0.9] transition-all duration-700",
                searchResults ? "text-3xl sm:text-4xl lg:text-5xl" : "text-5xl sm:text-7xl lg:text-9xl"
              )}>
                Go anywhere <br className="hidden sm:block" /> with <br className="sm:hidden" />
                <span className="text-black/20 italic">Uber Premium</span>
              </h1>
              {!searchResults && (
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 max-w-xl leading-relaxed font-normal bg-white/60 backdrop-blur-md p-3 rounded-2xl inline-block shadow-sm border border-white/40">
                  The world's most advanced ride-sharing and talent ecosystem. 
                  Move with elite precision.
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn(
                "transition-all duration-700 w-full flex flex-col min-h-0",
                !searchResults && "max-w-xl lg:mx-auto xl:mx-0",
                searchResults && "max-h-[90vh] sm:max-h-[85vh] lg:max-h-[80vh] xl:max-h-[75vh]"
              )}
            >
              <Card className="glass-card border-white/40 rounded-[2.5rem] shadow-2xl luxury-shadow flex flex-col overflow-hidden min-h-0">
                <Tabs defaultValue="ride" className="w-full flex-1 flex flex-col min-h-0">
                  {!searchResults && (
                    <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm pr-6 shrink-0">
                      <TabsList className="flex-1 sm:max-w-xs grid grid-cols-3 bg-transparent h-20 rounded-none p-0 border-r border-black/5">
                        <TabsTrigger 
                          value="ride" 
                          className="px-2 sm:px-4 data-[state=active]:bg-white/80 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-black h-full flex flex-col gap-1 transition-all"
                        >
                          <Car className="w-5 h-5 sm:w-6 h-6" />
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-none">Ride</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="drive" 
                          className="px-2 sm:px-4 data-[state=active]:bg-white/80 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-black h-full flex flex-col gap-1 transition-all"
                        >
                          <ArrowRight className="w-5 h-5 sm:w-6 h-6 rotate-[-45deg]" />
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-none">Drive</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="rent" 
                          className="px-2 sm:px-4 data-[state=active]:bg-white/80 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-black h-full flex flex-col gap-1 transition-all"
                        >
                          <Package className="w-5 h-5 sm:w-6 h-6" />
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-none">Rent</span>
                        </TabsTrigger>
                      </TabsList>
                      
                      <div className="px-3 sm:px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "rounded-full bg-white/50 border-white/40 font-bold gap-1 sm:gap-2 px-2 sm:px-3 h-8"
                            )}
                          >
                            <Globe className="w-3 h-3" />
                            <span className="text-xs">{currency.code}</span>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-card rounded-2xl border-white/20">
                          {CURRENCIES.map((c) => (
                            <DropdownMenuItem 
                              key={c.code} 
                              onClick={() => {
                                setCurrency(c);
                                setSearchResults(null);
                              }}
                              className="font-bold text-xs"
                            >
                              {c.code} ({c.symbol})
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                  
                  <TabsContent 
                    value="ride" 
                    className="flex-1 overflow-y-auto luxury-scrollbar mt-0"
                  >
                    <div className="p-6 lg:p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black group-hover:scale-125 transition-transform" />
                        <Input 
                          placeholder="Enter pickup location" 
                          value={pickup}
                          onFocus={() => setShowPickupSuggestions(true)}
                          onChange={(e) => setPickup(e.target.value)}
                          className="pl-12 h-14 bg-white/50 border-white/20 rounded-xl focus-visible:ring-black transition-all hover:bg-white/80"
                        />
                        <button 
                          type="button" 
                          onClick={fetchCurrentLocation}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-black/5 transition-colors group/loc"
                          title="Use current location"
                        >
                          <Navigation className={cn(
                            "w-4 h-4 transition-all",
                            isLocating ? "animate-pulse text-blue-500 scale-110" : "text-black/20 group-hover/loc:text-black"
                          )} />
                        </button>
                        
                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                          {showPickupSuggestions && filteredPickupSuggestions.length > 0 && (
                            <motion.div 
                              key="pickup-suggestions"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute left-0 right-0 top-full mt-2 bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                            >
                              {filteredPickupSuggestions.map((loc) => (
                                <div 
                                  key={loc}
                                  onClick={() => { setPickup(loc); setShowPickupSuggestions(false); }}
                                  className="px-6 py-4 hover:bg-black/5 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-0 border-black/5"
                                >
                                  <MapPin className="w-4 h-4 text-black/30" />
                                  <span className="text-sm font-medium">{loc}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-black group-hover:scale-125 transition-transform" />
                        <Input 
                          placeholder="Enter destination" 
                          value={destination}
                          onFocus={() => setShowDestSuggestions(true)}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-12 h-14 bg-white/50 border-white/20 rounded-xl focus-visible:ring-black transition-all hover:bg-white/80"
                        />
                        
                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                          {showDestSuggestions && filteredDestSuggestions.length > 0 && (
                            <motion.div 
                              key="dest-suggestions"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute left-0 right-0 top-full mt-2 bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                            >
                              {filteredDestSuggestions.map((loc) => (
                                <div 
                                  key={loc}
                                  onClick={() => { setDestination(loc); setShowDestSuggestions(false); }}
                                  className="px-6 py-4 hover:bg-black/5 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-0 border-black/5"
                                >
                                  <MapPin className="w-4 h-4 text-black/30" />
                                  <span className="text-sm font-medium">{loc}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {searchResults && (
                      <motion.div 
                         key="search-results"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="space-y-4 pt-2"
                      >
                        <div className="p-4 bg-black/5 rounded-2xl border border-black/[0.03] space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/40">
                             <span>Route Summary</span>
                             <span className="text-black">Dhaka Metro</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-black" />
                              <span className="text-sm font-bold truncate max-w-[120px]">{pickup}</span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-black/20" />
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                              <span className="text-sm font-bold truncate max-w-[120px]">{destination}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center px-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Available services in {currency.code === 'BDT' ? 'Dhaka' : 'Area'}</p>
                          <div className="px-2 py-0.5 bg-red-100/50 text-red-600 rounded-full text-[9px] font-bold uppercase tracking-wider animate-pulse border border-red-200">
                            High Demand nearby
                          </div>
                        </div>
                        {VEHICLE_TYPES.map((vt) => {
                          const res = searchResults.find(r => r.type === vt.id);
                          return (
                            <div 
                              key={vt.id}
                              onClick={() => setSelectedVehicle(vt.id)}
                              className={cn(
                                "p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all border-2 group",
                                selectedVehicle === vt.id 
                                  ? "bg-black text-white border-black shadow-[0_20px_40px_rgba(0,0,0,0.2)]" 
                                  : "bg-white/40 border-transparent hover:bg-white/80 hover:border-black/5"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                  selectedVehicle === vt.id ? "bg-white/10" : "bg-black/5"
                                )}>
                                  <vt.icon className="w-6 h-6" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold">{vt.name}</p>
                                    <span className={cn(
                                      "text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase",
                                      selectedVehicle === vt.id ? "bg-white/20 text-white" : "bg-black/10 text-black/60"
                                    )}>
                                      {res?.eta} min
                                    </span>
                                  </div>
                                  <p className={cn(
                                    "text-xs",
                                    selectedVehicle === vt.id ? "text-white/60" : "text-gray-400"
                                  )}>{vt.desc}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg leading-tight">
                                  {currency.symbol}{res?.price.toFixed(0)}
                                </p>
                                <p className={cn(
                                  "text-[9px] uppercase font-bold tracking-widest opacity-40",
                                  selectedVehicle === vt.id ? "text-white" : "text-black"
                                )}>incl. tax</p>
                              </div>
                            </div>
                          );
                        })}

                        <Button 
                          onClick={handleRequestRide}
                          disabled={isRequesting}
                          className="w-full h-16 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold text-xl shadow-xl luxury-shadow mt-4 group disabled:opacity-50"
                        >
                          {isRequesting ? "Searching..." : "Request Ride"}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => { setSearchResults(null); setRoutePoints({ pickup: null, destination: null }); }}
                          className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black"
                        >
                          Back to search
                        </Button>
                      </motion.div>
                    )}

                    {!searchResults && (
                      <Button 
                        onClick={calculatePrice}
                        disabled={isSearching || !pickup || !destination}
                        className="w-full h-16 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold text-xl shadow-lg hover:luxury-shadow transition-all mt-4 disabled:opacity-50"
                      >
                        {isSearching ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Calculating...
                          </div>
                        ) : "Find Rides"}
                      </Button>
                    )}
                    </div>
                  </TabsContent>

                  <TabsContent 
                    value="drive" 
                    className="flex-1 overflow-y-auto luxury-scrollbar mt-0"
                  >
                    <div className="p-6 sm:p-10 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Make money by driving</h3>
                      <p className="text-sm sm:text-base text-gray-600">Drive when you want, earn what you need.</p>
                    </div>
                    <Dialog>
                      <DialogTrigger
                        className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold text-base sm:text-lg shadow-lg hover:luxury-shadow transition-all font-bold flex items-center justify-center cursor-pointer"
                      >
                        Get started
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-[90vh] rounded-2xl sm:rounded-[2.5rem] border-0 bg-transparent shadow-none">
                        <div className="relative">
                          <DriverRegistrationForm />
                        </div>
                      </DialogContent>
                    </Dialog>
                    </div>
                  </TabsContent>

                  <TabsContent 
                    value="rent" 
                    className="flex-1 overflow-y-auto luxury-scrollbar mt-0"
                  >
                    <div className="p-6 sm:p-10 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Rent a car</h3>
                      <p className="text-sm sm:text-base text-gray-600">Wide selection for every occasion.</p>
                    </div>
                    <Button 
                      onClick={() => toast.info("Premium Fleet", { description: "Redirecting to our luxury car rental portal..." })}
                      className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold text-base sm:text-lg shadow-lg hover:luxury-shadow transition-all"
                    >
                      Search cars
                    </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


