"use client"
import { CheckCircle2, Users, TrendingUp, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function TrustSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { icon: Users, value: 1000000, label: "Monthly Shoppers" },
    { icon: CheckCircle2, value: 5000, label: "Products Reviewed" },
    { icon: TrendingUp, value: 98, label: "Satisfaction Rate" },
    { icon: Clock, value: 10, label: "Years Experience" },
  ];

  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const durations = [2000, 1800, 1500, 1200];
    const startTimes = stats.map(() => Date.now());
    
    const animate = () => {
      const currentTime = Date.now();
      
      const newValues = stats.map((stat, idx) => {
        const elapsed = currentTime - startTimes[idx];
        const duration = durations[idx];
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        return Math.floor(stat.value * easeOutQuart);
      });

      setAnimatedValues(newValues);

      if (newValues.some((val, idx) => val < stats[idx].value)) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible]);

  const formatNumber = (value, index) => {
    if (index === 0) return `${(value / 1000000).toFixed(1)}M+`;
    if (index === 1) return `${value.toLocaleString()}+`;
    if (index === 2) return `${value}%`;
    return `${value}+`;
  };

  return (
    <section ref={sectionRef} className="py-10 bg-gradient-to-b from-slate-20 to-blue-100/30 relative overflow-hidden">
      {/* Background decorative elements */}
    
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center ">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0215A6]/10 border border-[#0215A6]/20 mb-6">
            <div className="w-2 h-2 bg-[#0215A6] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#0215A6]">Trust & Reliability</span>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
            Our commitment to providing honest, comprehensive product reviews
            has made us the <span className="font-semibold text-[#0215A6]">go-to resource</span> for smart shoppers worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="text-center group relative"
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg shadow-black/5 transform group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#0215A6]/10 transition-all duration-300 border border-transparent group-hover:border-[#0215A6]/10"></div>
                
                <div className="relative z-10 p-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg mb-6 group-hover:scale-110 group-hover:bg-[#0215A6] transition-all duration-300 border border-[#0215A6]/10">
                    <Icon className="h-10 w-10 text-[#0215A6] group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0215A6] to-[#667eea] bg-clip-text text-transparent mb-3 font-mono">
                    {formatNumber(animatedValues[idx], idx)}
                  </div>
                  
                  <div className="text-base text-muted-foreground font-medium group-hover:text-[#0215A6] transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-12 pt-8 border-t border-[#0215A6]/10">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Verified Reviews
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Real-time Updates
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4 text-purple-500" />
              Community Driven
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;