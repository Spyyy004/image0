import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ConvertImages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Update page title for SEO
    document.title = "Convert Images — image0.dev";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert images between formats locally in your browser. JPEG, PNG, WebP. No uploading. Works offline. No tracking.');
    }
  }, []);

  const handleStartConverting = () => {
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
          <h1 className="text-4xl font-bold mb-6">Convert Images</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">What it does</h2>
              <p>
                Converts images between formats: JPEG, PNG, and WebP. Only images that need conversion are processed. 
                Images already in the target format are skipped.
              </p>
              <p>
                Supports batch processing. Convert multiple images to the same format at once.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Runs locally</h2>
              <p>
                All conversion happens in your browser using the Canvas API. Your images never leave your device. 
                No files are uploaded to any server. Processing works offline after the first page load.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Who it's for</h2>
              <p>
                Developers standardizing image formats for web projects. Designers converting assets for different platforms. 
                Anyone who needs to change image formats without installing software or creating accounts.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleStartConverting}
                className="w-full sm:w-auto"
              >
                Convert Images
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ConvertImages;

