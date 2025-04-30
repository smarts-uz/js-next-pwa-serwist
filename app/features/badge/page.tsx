import { Info } from "lucide-react";
import BadgeApiExample from "./components/BadgeApiExample";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BadgePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Badge API</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive guide to the Badge component's API and usage.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Badge Component</AlertTitle>
        <AlertDescription>
          Explore the versatile Badge component with various styling options and
          interactive examples.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            Explore Badge component functionality and variants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeApiExample />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Badge API Documentation</CardTitle>
          <CardDescription className="text-base">
            Detailed reference for Badge component properties and variants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Variants</h3>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded">default</code>{" "}
                - Standard badge style
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  secondary
                </code>{" "}
                - Alternative muted style
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  destructive
                </code>{" "}
                - Indicates a critical or warning state
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded">outline</code>{" "}
                - Minimal, outlined badge style
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgePage;
