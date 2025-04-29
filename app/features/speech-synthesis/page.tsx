import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SpeechSynthesisExample from "./components/SpeechSynthesisExample";

const SpeechSynthesisPage = () => {
  return (
    <>
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Speech Synthesis API</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Convert text to speech with customizable voices and settings
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpeechSynthesisExample />
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Understanding the Speech Synthesis API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  What is the Speech Synthesis API?
                </h3>
                <p className="text-sm text-muted-foreground">
                  The Speech Synthesis API allows web applications to convert
                  text to speech using the device's available voices. It
                  provides control over speech rate, pitch, volume, and voice
                  selection.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Text-to-speech conversion</li>
                  <li>Multiple voice selection</li>
                  <li>Adjustable speech rate</li>
                  <li>Customizable pitch</li>
                  <li>Volume control</li>
                  <li>Pause and resume functionality</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Browser Support</h3>
                <p className="text-sm text-muted-foreground">
                  The Speech Synthesis API is supported in most modern browsers.
                  Available voices may vary depending on the operating system
                  and browser.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Check for API support</li>
                  <li>Load voices asynchronously</li>
                  <li>Handle voice loading errors</li>
                  <li>Provide fallback options</li>
                  <li>Consider user preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Example Use Cases</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Screen readers</li>
                  <li>Text-to-speech applications</li>
                  <li>Accessibility features</li>
                  <li>Language learning tools</li>
                  <li>Audio feedback systems</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SpeechSynthesisPage;
