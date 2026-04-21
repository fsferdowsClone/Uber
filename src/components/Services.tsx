import { motion } from "motion/react";
import { Shield, Users, Zap, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Black Premium",
    description: "Premium rides in luxury cars with our highest-rated professional drivers.",
    icon: Shield,
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Sustainability",
    description: "Go green with 100% electric and hybrid vehicles for a zero-emission ride.",
    icon: Zap,
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Premium Van",
    description: "Spacious luxury for groups up to 6. Perfect for business and travel.",
    icon: Users,
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
  },
];

export function Services() {
  return (
    <section className="py-12 sm:py-16 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-10 mb-12 lg:mb-20 text-center lg:text-left">
          <div className="space-y-4 lg:space-y-6">
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-black/30"
            >
              Excellence in motion
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter"
            >
              Designed for luxury. <br /> <span className="italic opacity-20">Built for you.</span>
            </motion.h2>
          </div>
          <p className="text-gray-400 max-w-sm lg:pb-4 text-center lg:text-right text-sm sm:text-base px-6 lg:px-0 opacity-80">
            Every detail is crafted to provide a seamless, premium experience from pickup to destination.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="group cursor-pointer border-0 glass-surface rounded-[2.5rem] overflow-hidden hover:bg-white/95 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-3">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/40">
                    <Star className="w-3.5 h-3.5 fill-black" />
                    <span className="text-xs font-bold">{service.rating}</span>
                  </div>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                <CardContent className="p-10 space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold tracking-tighter">{service.title}</h3>
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
                      <service.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    {service.description}
                  </p>
                  <div className="pt-6 border-t border-black/5 flex items-center text-sm font-bold tracking-widest uppercase gap-3 group/btn">
                    <span>Learn more</span> 
                    <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

