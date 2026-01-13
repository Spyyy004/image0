import { useEffect } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  useEffect(() => {
    // Update page title for SEO
    document.title = "How image0.dev Works — image0.dev";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how image0.dev works. Everything runs locally in your browser. No uploads, no servers, no tracking. Open source and private by default.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-3xl mx-auto px-4 py-24">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6">How image0.dev Works</h1>
          
          <div className="space-y-8 text-muted-foreground">
            <p className="text-lg">
              image0.dev is designed to be predictable, inspectable, and private by default.
            </p>
            <p>
              This page explains exactly what happens when you use it — and what never happens.
            </p>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Everything runs locally</h2>
              <p>
                All image processing happens inside your browser.
              </p>
              <p>When you drop an image (or a folder of images) into image0.dev:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The file stays on your device</li>
                <li>Processing happens using browser APIs and web workers</li>
                <li>The result is generated locally and offered for download</li>
              </ul>
              <p className="mt-4">
                At no point are your images uploaded to a server.
              </p>
              <p>There is no backend.</p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No uploads, no servers</h2>
              <p>image0.dev does not send your files anywhere.</p>
              <p>There are:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No upload endpoints</li>
                <li>No storage servers</li>
                <li>No cloud processing</li>
                <li>No background requests involving your images</li>
              </ul>
              <p className="mt-4">
                If you disconnect from the internet after loading the site, image0.dev continues to work.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Works offline (after first load)</h2>
              <p>Once the site is loaded in your browser:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All required code is cached locally</li>
                <li>You can use the tools in airplane mode</li>
                <li>Image processing remains fully functional</li>
              </ul>
              <p className="mt-4">
                Offline support exists to reinforce the idea that this is a local tool, not a cloud service.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What the browser does</h2>
              <p>Your browser handles:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reading image files</li>
                <li>Decoding and encoding formats (PNG, JPG, WEBP)</li>
                <li>Compression and resizing</li>
                <li>Metadata (EXIF) removal</li>
                <li>Batch processing using web workers</li>
              </ul>
              <p className="mt-4">
                image0.dev only orchestrates these capabilities — it does not introduce custom servers or hidden processing.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What image0.dev does NOT do</h2>
              <p>image0.dev intentionally avoids many common patterns.</p>
              <p>It does NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Track users</li>
                <li>Use analytics scripts</li>
                <li>Store image history</li>
                <li>Save files automatically</li>
                <li>Create accounts</li>
                <li>Sync data across devices</li>
                <li>Modify images without your action</li>
              </ul>
              <p className="mt-4">
                All state is temporary and exists only for the current session.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Open source by design</h2>
              <p>The entire project is open source under the MIT license.</p>
              <p>You can inspect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The UI code</li>
                <li>The image processing logic</li>
                <li>The web worker setup</li>
                <li>The offline caching behavior</li>
              </ul>
              <p className="mt-4">Nothing is hidden.</p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why it's built this way</h2>
              <p>image0.dev is meant to be boring in the best possible way.</p>
              <p>The goal is not to add features endlessly, but to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be fast</li>
                <li>Be clear</li>
                <li>Be trustworthy</li>
                <li>Do one job well</li>
              </ul>
              <p className="mt-4">
                If a feature makes it harder to explain where your files go, it doesn't belong here.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Compress Images Locally</h2>
              <p className="text-lg">This page explains how image compression works on image0.dev and when to use it.</p>

              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">What this tool does</h3>
                  <p>The image compression tool reduces file size while preserving visual quality.</p>
                  <p>You can:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Compress single images</li>
                    <li>Compress entire folders</li>
                    <li>Preview results before downloading</li>
                    <li>Export images with metadata removed</li>
                  </ul>
                  <p className="mt-4">All processing happens locally in your browser.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">How compression works here</h3>
                  <p>When you compress an image:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>The original file is read in memory</li>
                    <li>The image is re-encoded using browser-native encoders</li>
                    <li>Output quality is controlled using simple, predictable presets</li>
                    <li>A new file is generated for download</li>
                  </ol>
                  <p className="mt-4">The original image is never modified or overwritten.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Before / after preview</h3>
                  <p>Before downloading, you can preview:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The original image</li>
                    <li>The compressed output</li>
                    <li>File size differences</li>
                  </ul>
                  <p className="mt-4">
                    This allows you to verify results visually instead of guessing.
                  </p>
                  <p>Previews exist only in memory and are cleared when you remove the image.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Batch and folder support</h3>
                  <p>You can compress:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Multiple images at once</li>
                    <li>Entire folders (where supported by the browser)</li>
                  </ul>
                  <p className="mt-4">Non-image files are ignored automatically.</p>
                  <p>Folder structure is not uploaded, stored, or preserved beyond the current session.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Privacy and metadata</h3>
                  <p>By default, compressed images:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Have EXIF metadata removed</li>
                    <li>Do not include location, camera, or device information</li>
                  </ul>
                  <p className="mt-4">This helps reduce file size and improves privacy.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">When to use this tool</h3>
                  <p>Use local compression when you:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Need smaller files for web or email</li>
                    <li>Don't want to upload private or client images</li>
                    <li>Are working offline</li>
                    <li>Want predictable, repeatable output</li>
                  </ul>
                  <p className="mt-4">
                    If you need advanced editing or design tools, this is intentionally not the right product.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">What this tool does not do</h3>
                  <p>This compression tool does not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Enhance images</li>
                    <li>Use AI</li>
                    <li>Add filters or effects</li>
                    <li>Store previous images</li>
                    <li>Sync across devices</li>
                  </ul>
                  <p className="mt-4">It compresses images, locally, and nothing more.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Summary</h3>
                  <p>
                    The compress images tool exists to do one thing well: reduce file size without sending your images anywhere.
                  </p>
                  <p className="mt-4">
                    If you understand how it works, you already understand the rest of image0.dev.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;

