import * as React from "react";
import { motion } from "motion/react";
import { Search, MapPin, Briefcase, User, Send, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { jobService, Job, JobType } from "@/services/jobService";
import { toast } from "sonner";
import { Clock, GraduationCap, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EmployeeBoard() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isPostDialogOpen, setIsPostDialogOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<JobType | "All">("All");
  
  // Post Job State
  const [newJob, setNewJob] = React.useState({
    title: "",
    description: "",
    area: "",
    category: "General",
    budget: "",
    type: "One-time" as JobType
  });

  React.useEffect(() => {
    return jobService.subscribe(setJobs);
  }, []);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    jobService.addJob({
      title: newJob.title,
      description: newJob.description,
      area: newJob.area,
      category: newJob.category,
      posterName: "Ferdows S.", 
      budget: Number(newJob.budget),
      type: newJob.type,
      requirements: ["Verified Identity", "Professionalism"]
    });
    setIsPostDialogOpen(false);
    toast.success("Job Posted Successfully!");
    setNewJob({ title: "", description: "", area: "", category: "General", budget: "", type: "One-time" });
  };

  const handleApply = (jobId: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Sending application...',
        success: 'Application sent! The employer will contact you soon.',
        error: 'Failed to send application.'
      }
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
        <div className="space-y-6 text-left">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold uppercase tracking-[0.3em] text-black/30"
          >
            Work Opportunities
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold tracking-tighter"
          >
            The Premium <span className="italic opacity-20 text-black">Talent Exchange</span>
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Connect with verified local talent or post assignments for your vicinity.
            Earn money, assign tasks, and build your professional community.
          </p>
        </div>
        
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-16 px-10 rounded-2xl bg-black text-white hover:bg-black/90 font-bold text-lg shadow-2xl luxury-shadow shrink-0 flex items-center justify-center cursor-pointer"
            )}
          >
            Post a New Job
            <Send className="w-5 h-5 ml-2" />
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 sm:max-w-[500px] p-0 overflow-hidden shadow-2xl luxury-shadow">
            <DialogHeader className="p-8 bg-black text-white">
              <DialogTitle className="text-3xl font-bold tracking-tighter">Post an Assignment</DialogTitle>
              <p className="opacity-60 text-sm">Fill in the details to find talent near you.</p>
            </DialogHeader>
            <form onSubmit={handlePostJob} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Assignment Title</label>
                  <Input 
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Courier for Gulshan Area" 
                    className="h-12 bg-black/5 border-transparent focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Description</label>
                  <Input 
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    placeholder="Describe the task and requirements..." 
                    className="h-12 bg-black/5 border-transparent focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Vicinity/Area</label>
                    <Input 
                      required
                      value={newJob.area}
                      onChange={(e) => setNewJob({...newJob, area: e.target.value})}
                      placeholder="e.g. Dhaka" 
                      className="h-12 bg-black/5 border-transparent focus:bg-white transition-all rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Budget (BDT)</label>
                    <Input 
                      required
                      type="number"
                      value={newJob.budget}
                      onChange={(e) => setNewJob({...newJob, budget: e.target.value})}
                      placeholder="Amount" 
                      className="h-12 bg-black/5 border-transparent focus:bg-white transition-all rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Employment Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Full-time", "Part-time", "One-time", "Regular"].map((t) => (
                      <Button
                        key={t}
                        type="button"
                        variant={newJob.type === t ? "default" : "outline"}
                        onClick={() => setNewJob({...newJob, type: t as JobType})}
                        className={cn(
                          "h-10 text-[10px] font-bold uppercase rounded-lg",
                          newJob.type === t ? "bg-black text-white" : "border-black/5 hover:bg-black/5"
                        )}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl bg-black text-white hover:bg-black/90 font-bold text-lg shadow-lg">
                Activate Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-zinc-50/50 p-4 rounded-[2.5rem] border border-black/[0.03]">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search by area, title or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-16 pl-14 bg-white border-white/20 rounded-2xl shadow-sm focus-visible:ring-black transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
          {["All", "Full-time", "Part-time", "One-time", "Regular"].map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type as any)}
              className={cn(
                "h-12 px-6 rounded-xl font-bold transition-all",
                selectedType === type ? "bg-black text-white" : "bg-white text-gray-500 hover:text-black"
              )}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "glass-card border-white/40 overflow-hidden rounded-[2.5rem] transition-all hover:translate-y-[-4px] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] bg-white",
              job.status === "assigned" && "opacity-60 grayscale-[0.5]"
            )}>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-3">
                    <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg luxury-shadow">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <Badge variant="secondary" className="bg-black/5 text-black border-transparent font-bold">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] mb-3 inline-flex items-center gap-1.5",
                      job.status === "open" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", job.status === "open" ? "bg-emerald-500" : "bg-gray-400")} />
                      {job.status}
                    </div>
                    <p className="text-2xl font-bold tracking-tighter text-black">৳{job.budget.toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Estim. Budget</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tighter leading-tight text-black">{job.title}</h3>
                  <p className="text-gray-500 line-clamp-3 leading-relaxed text-sm h-15">{job.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {job.requirements?.slice(0, 2).map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      {req}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 pt-6 border-t border-black/[0.03]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-black/60" />
                      </div>
                      <span>{job.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Today</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/${job.posterName}/100/100`} alt="Poster" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{job.posterName}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" title="Verified" />
                    </div>
                  </div>
                </div>

                {job.status === "open" ? (
                  <Button 
                    onClick={() => handleApply(job.id)}
                    className="w-full h-16 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold group shadow-xl luxury-shadow"
                  >
                    Apply for Job
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <div className="w-full h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2 font-bold text-gray-400 italic">
                    <Shield className="w-5 h-5" />
                    Contract Active
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Post a Job CTA */}
      <section className="glass-card rounded-[3rem] p-8 lg:p-16 relative overflow-hidden bg-black text-white text-center lg:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter">Reach verified talent</h2>
            <p className="text-lg opacity-60 leading-relaxed">
              Post your high-value assignments and find professional talent in your area instantly.
            </p>
          </div>
          <Button 
            onClick={() => setIsPostDialogOpen(true)}
            className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg shadow-xl luxury-shadow"
          >
            Post an Assignment
            <Send className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
