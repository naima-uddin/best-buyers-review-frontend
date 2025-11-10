import { CheckCircle2, Users, TrendingUp, Clock } from "lucide-react";

function TrustSection() {
  const stats = [
    { icon: Users, value: "1M+", label: "Monthly Shoppers" },
    { icon: CheckCircle2, value: "5,000+", label: "Products Reviewed" },
    { icon: TrendingUp, value: "98%", label: "Satisfaction Rate" },
    { icon: Clock, value: "10+", label: "Years Experience" },
  ];

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Millions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our commitment to providing honest, comprehensive product reviews
            has made us a go-to resource for smart shoppers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0215A6]/10 mb-4">
                  <Icon className="h-8 w-8 text-[#0215A6]" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#0215A6] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default TrustSection;