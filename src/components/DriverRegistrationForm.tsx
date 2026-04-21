import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Car, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  ShieldCheck,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  licenseNumber: z.string().min(5, "Invalid license number"),
  vehicleMake: z.string().min(2, "Required"),
  vehicleModel: z.string().min(2, "Required"),
  vehicleYear: z.string().regex(/^\d{4}$/, "Must be a 4-digit year"),
  vehicleColor: z.string().min(3, "Required"),
  licensePlate: z.string().min(3, "Required"),
});

type FormData = z.infer<typeof formSchema>;

export function DriverRegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setRegisteredEmail(data.email);
    
    try {
      const response = await fetch("/api/register-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 lg:p-16 text-center space-y-8 glass-card border-0 rounded-[2.5rem]"
      >
        <div className="relative">
          <div className="w-24 h-24 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/20">
            <Mail className="w-10 h-10 text-black animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full border-4 border-white">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter">Verify your email</h2>
          <p className="text-gray-600 max-w-sm leading-relaxed mx-auto">
            We've sent a verification link to <span className="font-bold text-black">{registeredEmail}</span>. 
            Please check your inbox (and spam folder) to complete your application.
          </p>
        </div>
        <div className="flex flex-col w-full gap-3 pt-4 max-w-xs mx-auto">
          <Button 
            onClick={() => window.open(`https://${registeredEmail.split('@')[1]}`, '_blank')}
            className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold"
          >
            Open Mail App
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setIsSuccess(false)}
            className="text-gray-400 hover:text-black font-bold h-12"
          >
            Resend Email
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="glass-card border-0 overflow-hidden rounded-[2.5rem] shadow-none">
      <CardContent className="p-6 sm:p-8 lg:p-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 sm:space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter">Join the community</h2>
            <p className="text-gray-500">Provide your details to start earning with Uber Premium.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <User className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <Input 
                    {...register("fullName")}
                    placeholder="Full Name" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.fullName && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Input 
                    {...register("email")}
                    type="email"
                    placeholder="Email Address" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.email && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Input 
                    {...register("phone")}
                    placeholder="Phone Number" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.phone && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1">
                  <Input 
                    {...register("licenseNumber")}
                    placeholder="Driver's License Number" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.licenseNumber && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.licenseNumber && <p className="text-xs text-red-500 ml-1">{errors.licenseNumber.message}</p>}
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <Car className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40">Vehicle Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input 
                    {...register("vehicleMake")}
                    placeholder="Make (e.g. Tesla)" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.vehicleMake && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.vehicleMake && <p className="text-xs text-red-500 ml-1">{errors.vehicleMake.message}</p>}
                </div>
                <div className="space-y-1">
                  <Input 
                    {...register("vehicleModel")}
                    placeholder="Model (e.g. Model S)" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.vehicleModel && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.vehicleModel && <p className="text-xs text-red-500 ml-1">{errors.vehicleModel.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input 
                    {...register("vehicleYear")}
                    placeholder="Year" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.vehicleYear && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.vehicleYear && <p className="text-xs text-red-500 ml-1">{errors.vehicleYear.message}</p>}
                </div>
                <div className="space-y-1">
                  <Input 
                    {...register("vehicleColor")}
                    placeholder="Color" 
                    className={cn(
                      "h-14 bg-white/50 border-white/20 rounded-xl",
                      errors.vehicleColor && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.vehicleColor && <p className="text-xs text-red-500 ml-1">{errors.vehicleColor.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Input 
                  {...register("licensePlate")}
                  placeholder="License Plate Number" 
                  className={cn(
                    "h-14 bg-white/50 border-white/20 rounded-xl",
                    errors.licensePlate && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.licensePlate && <p className="text-xs text-red-500 ml-1">{errors.licensePlate.message}</p>}
              </div>

              <div className="bg-black/5 rounded-xl p-4 flex gap-3 text-xs text-gray-500 leading-tight">
                <ShieldCheck className="w-5 h-5 shrink-0 text-black/40" />
                <p>
                  Uber Premium verifies all vehicle details against state databases. 
                  Inaccurate information will result in delayed registration.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 rounded-[1.25rem] bg-black text-white hover:bg-zinc-800 font-bold text-xl transition-all shadow-xl hover:luxury-shadow disabled:opacity-70 group"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Submit Application
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
            <p className="text-center text-xs text-gray-400 mt-4">
              By clicking Submit, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
