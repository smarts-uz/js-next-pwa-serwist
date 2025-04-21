import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "./CodeBlock";

interface ExampleCardProps {
  title: string;
  description: string;
  code: string;
}

export const ExampleCard: FC<ExampleCardProps> = ({
  title,
  description,
  code,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock code={code} />
      </CardContent>
    </Card>
  );
};
