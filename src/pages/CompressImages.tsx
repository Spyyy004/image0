import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CompressImages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Update page title for SEO
    document.title = "Compress Images — image0.dev";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compress images locally in your browser. Reduce file size without uploading. Works offline. No tracking.');
    }
  }, []);

  const handleStartCompressing = () => {
    navigate('/#editor');
    // Small delay to ensure navigation happens, then scroll
    setTimeout(() => {
      const editor = document.getElementById('editor');
      if (editor) {
        editor.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-3xl mx-auto px-4 py-24">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6">Compress Images</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">What it does</h2>
              <p>
                Compresses image files to reduce their size. You can adjust quality from 10% to 100%. 
                Lower quality produces smaller files. Higher quality preserves more detail.
              </p>
              <p>
                PNG files are converted to JPEG during compression, as JPEG compression is more effective.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Runs locally</h2>
              <p>
                All compression happens in your browser using the Canvas API. Your images never leave your device. 
                No files are uploaded to any server. Processing works offline after the first page load.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Who it's for</h2>
              <p>
                Developers reducing image sizes for web projects. Designers preparing assets for delivery. 
                Anyone who needs smaller image files without installing software or creating accounts.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleStartCompressing}
                className="w-full sm:w-auto"
              >
                Compress Images
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default CompressImages;

