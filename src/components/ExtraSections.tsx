import { motion } from "motion/react";
import { Shield, Smartphone, Heart, ArrowRight, Leaf, Eye, Lock, Zap, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AppFeatures() {
  return (
    <div className="space-y-20 lg:space-y-32 py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Safety Section */}
      <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 order-2 lg:order-1"
        >
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tighter leading-tight px-2 lg:px-0">
              Our commitment to <span className="italic opacity-30">your safety</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0 px-4 lg:px-0">
              With every safety feature we add and every standard we uphold, 
              we're committed to helping create a safe environment for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center lg:text-left px-4 lg:px-0">
            <div className="space-y-4">
              <div className="w-12 h-12 glass-surface rounded-2xl flex items-center justify-center mx-auto lg:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Safety features</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tell your loved ones where you are. Get help with the tap of a button. 
                Technology makes it easier than ever to ride safely.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 glass-surface rounded-2xl flex items-center justify-center mx-auto lg:mx-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">24/7 Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Help is always available through our support center and safety toolkit 
                within the app.
              </p>
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <Button 
              variant="link" 
              onClick={() => toast.info("Safety Toolkit", { description: "You are being redirected to our comprehensive safety documentation." })}
              className="group p-0 text-black font-bold h-auto"
            >
              See all safety features
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square lg:aspect-video rounded-[3rem] overflow-hidden glass-card p-4 order-1 lg:order-2"
        >
          <img 
            src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=2070" 
            alt="Safety" 
            className="w-full h-full object-cover rounded-[2.5rem]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8 lg:p-12">
            <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-3xl border border-white/20 text-white max-w-sm">
              <p className="text-xs font-medium opacity-80 uppercase tracking-widest mb-1 lg:mb-2">Did you know?</p>
              <p className="text-base lg:text-lg font-bold leading-tight">99% of rides are completed without any safety issues reported.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sustainability Section */}
      <section className="glass-card rounded-[2.5rem] lg:rounded-[4rem] p-6 lg:p-20 relative overflow-hidden text-black">
        <div className="absolute top-0 right-0 w-64 lg:w-96 h-64 lg:h-96 bg-green-200/20 rounded-full blur-[80px] lg:blur-[100px] -mr-32 lg:-mr-48 -mt-32 lg:-mt-48" />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-black text-white rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto lg:mx-0">
              <Leaf className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter px-4 lg:px-0">Zero emissions by 2040</h2>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed px-4 lg:px-0">
                We're committed to becoming a zero-emission platform, with 100% of rides 
                taking place in zero-emission vehicles, on public transit, or with micro-mobility.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-4 px-4 lg:px-0">
              <div className="bg-white/40 p-6 rounded-3xl border border-white/20 space-y-3">
                <Zap className="w-5 h-5 text-green-600 mx-auto sm:mx-0" />
                <h4 className="font-bold">Uber Green</h4>
                <p className="text-sm text-gray-500">Pick a hybrid or electric vehicle and ride more sustainably.</p>
              </div>
              <div className="bg-white/40 p-6 rounded-3xl border border-white/20 space-y-3">
                <Heart className="w-5 h-5 text-red-400 mx-auto sm:mx-0" />
                <h4 className="font-bold">Public Transit</h4>
                <p className="text-sm text-gray-500">Integrated routes to help you navigate your city efficiently.</p>
              </div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2072" 
                alt="Electric Car" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section - Small Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Eye, title: "Transparency", desc: "Know everything before you book-price, driver, and ETA." },
          { icon: Lock, title: "Privacy", desc: "Your data is yours. We protect it with banking-grade security." },
          { icon: Shield, title: "Assistance", desc: "24/7 support for every rider and driver, worldwide." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-surface p-8 rounded-[2.5rem] space-y-4 hover:scale-[1.02] transition-all cursor-default"
          >
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

export function DownloadSection() {
  return (
    <div className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <section className="glass-card rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 relative overflow-hidden bg-black text-white">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -mb-64 -mr-64" />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tighter">It's easier in <br/>the <span className="italic opacity-50 text-white">Uber app</span></h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <Button size="lg" className="flex-1 sm:flex-none bg-white text-black hover:bg-white/90 h-14 sm:h-16 px-6 sm:px-8 rounded-xl sm:rounded-2xl gap-3 font-bold text-sm sm:text-base">
                <Smartphone className="w-5 h-5 sm:w-6 h-6" /> App Store
              </Button>
              <Button size="lg" variant="outline" className="flex-1 sm:flex-none border-white/20 text-white hover:bg-white/10 h-14 sm:h-16 px-6 sm:px-8 rounded-xl sm:rounded-2xl gap-3 font-bold text-sm sm:text-base">
                <Smartphone className="w-5 h-5 sm:w-6 h-6" /> Google Play
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row gap-6 p-6 lg:p-8 bg-white/10 backdrop-blur-xl rounded-[2rem] lg:rounded-[2.5rem] border border-white/20 w-full sm:w-auto">
            <div className="w-full sm:w-32 h-32 bg-white rounded-2xl p-2">
              <div className="w-full h-full bg-black/5 rounded-lg flex items-center justify-center border-2 border-black/5">
                <Smartphone className="w-12 h-12 text-black/10" />
              </div>
            </div>
            <div className="flex flex-col justify-center text-center sm:text-left pr-0 sm:pr-8 space-y-1">
              <p className="font-bold text-lg">Scan to download</p>
              <p className="text-white/50 text-sm">Download the app for <br/>a better experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
