import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheableResponseDemo } from "@/components/CacheableResponseDemo";

export default function CacheableResponsePage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Cacheable Response</CardTitle>
          <CardDescription>
            Test which HTTP responses are cached based on their status codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CacheableResponseDemo />
        </CardContent>
      </Card>
    </div>
  );
} 