import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TouchEventsExample from "./components/TouchEventsExample";
export default function TouchEventsFeature() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Multi Touch Demo</h1>
      <TouchEventsExample />
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Touch Events Use Cases</h3>
          <CardDescription>
            Common applications and scenarios where touch events enhance user
            interaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Badge variant="outline">Mobile Games</Badge>
              <span className="text-muted-foreground">
                Interactive apps and games
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Drawing Apps</Badge>
              <span className="text-muted-foreground">
                Drawing and painting applications
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Gestures</Badge>
              <span className="text-muted-foreground">
                Gesture-based navigation
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Zoom & Pan</Badge>
              <span className="text-muted-foreground">
                Multi-touch zoom and pan interfaces
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Forms</Badge>
              <span className="text-muted-foreground">
                Touch-based form inputs and controls
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline">Maps</Badge>
              <span className="text-muted-foreground">
                Interactive maps and visualizations
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
