import { Upload, Settings, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Drop your image",
    description: "Drag & drop or click to select",
  },
  {
    icon: Settings,
    title: "Choose your action",
    description: "Resize, compress, convert, or strip metadata",
  },
  {
    icon: Download,
    title: "Download instantly",
    description: "Get your processed image immediately",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-card">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step number */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
