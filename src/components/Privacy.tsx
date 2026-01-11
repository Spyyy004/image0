import { Shield, Wifi, Eye, Database } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "No files are uploaded",
    description: "All processing happens in your browser using the Canvas API.",
  },
  {
    icon: Database,
    title: "No data is stored",
    description: "We don't save, cache, or retain any of your images.",
  },
  {
    icon: Eye,
    title: "No tracking scripts",
    description: "Zero analytics, no cookies, no third-party services.",
  },
  {
    icon: Wifi,
    title: "Works offline",
    description: "Disconnect from the internet. This tool will still work.",
  },
];

const Privacy = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Your images never leave your device.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            image0.dev runs entirely in your browser. We built it this way because privacy shouldn't be optional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Privacy;
