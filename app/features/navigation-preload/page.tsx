import { NavigationPreloadDemo } from "./components/NavigationPreloadDemo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function NavigationPreloadPage() {
  return (
    <div className="space-y-4">
      <NavigationPreloadDemo />

      <Card>
        <CardHeader>
          <CardTitle>About Navigation Preload</CardTitle>
          <CardDescription>
            Learn how navigation preload works and its benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Navigation preload is a performance optimization feature that
              allows the browser to start loading resources before the service
              worker has a chance to respond to navigation requests. This can
              significantly improve the perceived performance of your PWA.
            </AlertDescription>
          </Alert>
          <div className="text-sm space-y-2">
            <p>
              <strong>Benefits:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Faster page loads during navigation</li>
              <li>Reduced perceived latency</li>
              <li>Better user experience</li>
              <li>Works with service worker caching strategies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
