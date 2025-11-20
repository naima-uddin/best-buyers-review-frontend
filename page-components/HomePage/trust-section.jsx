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
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-4 lg:py-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #000 2%, transparent 0%), radial-gradient(circle at 75px 75px, #000 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 shadow-sm mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trust & Reliability
            </span>
            
          </div>

          <h2 className="text-3xl md:text-4xl  font-bold text-gray-900 mb-2">
            Trusted by Millions
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our commitment to providing honest, comprehensive product reviews
            has made us the <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">go-to resource</span> for smart shoppers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="text-center group relative"
              >
                {/* Enhanced card with gradient border */}
                <div className="relative bg-white rounded-2xl shadow-lg shadow-gray-200/60  transform group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden border border-cyan-100">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/40 group-hover:via-purple-50/40 group-hover:to-pink-50/40 transition-all duration-500"></div>
                  
                  <div className="relative z-10 p-8">
                    {/* Animated icon container */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md shadow-gray-200/50 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-500  group-hover:border-transparent border border-blue-100">
                      <Icon className="h-8 w-8 text-gray-600 group-hover:text-white transition-all duration-500" />
                    </div>
                    
                    {/* Animated number */}
                    <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 font-mono group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
                      {formatNumber(animatedValues[idx], idx)}
                    </div>
                    
                    {/* Label with enhanced typography */}
                    <div className="text-lg font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300 tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced trust indicators */}
        <div className="text-center mt-16 pt-12 border-t border-gray-200">
          <p className="text-lg font-semibold text-gray-500 mb-6">Why Trust Us?</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-green-50 border border-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Verified Reviews</span>
            </span>
            <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-medium">Real-time Updates</span>
            </span>
            <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-purple-700 font-medium">Community Driven</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;