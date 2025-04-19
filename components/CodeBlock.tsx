import type { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ code, className }) => {
  return (
    <Card className={cn("mt-4 overflow-hidden", className)}>
      <CardContent className="p-0">
        <pre className="language-javascript overflow-x-auto p-4 text-sm">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
};
