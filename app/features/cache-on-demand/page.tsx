import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CacheOnDemandExample from "./components/CacheOnDemandExample";
import CacheUrlsExample from "./components/CacheUrlsExample";

export default function Page() {
  return (
    <>
      <CacheOnDemandExample />
      <CacheUrlsExample />
      <Card>
        <CardHeader>
          <CardTitle>About Cache On Demand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Cache on demand is a powerful feature of Progressive Web Apps that
            allows you to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Cache specific content when needed</li>
            <li>Optimize storage usage by caching only required resources</li>
            <li>Provide offline access to important content</li>
            <li>Improve performance by serving cached content instantly</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
