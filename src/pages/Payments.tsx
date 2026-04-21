import * as React from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, ShieldCheck, History, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Payments() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="space-y-6 text-center lg:text-left">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-bold uppercase tracking-[0.3em] text-black/30"
        >
          Financial Hub
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl min-[400px]:text-5xl lg:text-7xl font-bold tracking-tighter"
        >
          Personal <span className="italic opacity-20 text-black">Wallet</span>
        </motion.h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-black text-white rounded-[2.5rem] overflow-hidden p-8 lg:p-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10 space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/40">Total Balance</p>
                  <h2 className="text-4xl min-[400px]:text-5xl sm:text-6xl font-bold tracking-tighter truncate">৳45,200.00</h2>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="h-14 rounded-xl bg-white text-black hover:bg-white/90 px-8 font-bold gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Add Funds
                </Button>
                <Button variant="outline" className="h-14 rounded-xl border-white/20 text-white hover:bg-white/10 px-8 font-bold gap-2">
                  <ArrowDownLeft className="w-4 h-4" /> Withdraw
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter">Recent Transactions</h3>
            <div className="space-y-4">
              {[
                { type: "Ride Fare", amount: "-৳1,250", date: "Today, 2:45 PM", icon: History },
                { type: "Job Payout", amount: "+৳15,000", date: "Yesterday", icon: ShieldCheck },
                { type: "Top up", amount: "+৳5,000", date: "Oct 20, 2023", icon: ArrowUpRight },
              ].map((tx, i) => (
                <div key={i} className="glass-surface p-6 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                      <tx.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">{tx.type}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <p className={cn("font-bold text-lg", tx.amount.startsWith("+") ? "text-green-600" : "text-black")}>
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Payment Methods */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter">Payment Methods</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-zinc-800 to-black text-white rounded-2xl space-y-8 shadow-xl">
                <div className="flex justify-between items-start text-xs font-bold tracking-widest opacity-60">
                  <p>PREMIUM VISA</p>
                  <CreditCard className="w-6 h-6" />
                </div>
                <p className="text-xl font-mono tracking-widest">**** **** **** 4220</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] opacity-40 uppercase">Card Holder</p>
                    <p className="font-bold uppercase tracking-tighter">Ferdows S.</p>
                  </div>
                  <p className="font-bold opacity-60">12/28</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full h-16 rounded-2xl border-dashed border-black/10 hover:border-black/30 hover:bg-black/5 flex items-center gap-3 font-bold">
                <Plus className="w-5 h-5" /> Add New Method
              </Button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] space-y-4">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold">Secured Transactions</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every payment is secured by end-to-end encryption. Uber Premium doesn't store your full CVV details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
