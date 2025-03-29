import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BroadcastUpdateTest } from "@/components/BroadcastUpdateTest";

export default function BroadcastPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Broadcast Update Test</CardTitle>
          <CardDescription>
            Test the broadcast update functionality across multiple tabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BroadcastUpdateTest />
        </CardContent>
      </Card>
    </div>
  );
} 