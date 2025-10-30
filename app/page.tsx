"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export const getTriggers = async () => {
  const { data } = await axios.get("http://localhost:8000/v1/triggers");
  return data;
};

const triggers = [
  {
    id: "1",
    title: "High River Level Alert",
    description: "Trigger when river level exceeds 5 meters",
    isMandatory: true,
    isTriggered: true,
    triggerStatement: {
      phase: "Alert",
      riverBasin: "Ganges",
      source: "Sensor Network",
      expression: "river_level > 5",
    },
  },
  {
    id: "2",
    title: "Moderate Rainfall Warning",
    description: "Trigger when rainfall exceeds 100mm in 24 hours",
    isMandatory: false,
    isTriggered: false,
    triggerStatement: {
      phase: "Warning",
      riverBasin: "Brahmaputra",
      source: "Weather Station",
      expression: "rainfall_24h > 100",
    },
  },
];

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["triggers"],
    queryFn: getTriggers,
  });
  /*

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <p>Error</p>
          <p className="text-red-500">
            {error.message || "Someething went wrong.."}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <p className="text-blue-400">Loading....</p>
        </div>
      </div>
    );
  }
*/
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Trigger Statements
            </h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Manage automated and manual trigger statements for flood
              monitoring
            </p>
          </div>
          <Link href="/add-trigger">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Trigger
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {triggers?.map((trigger) => (
            <Card
              key={trigger.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl text-balance">
                    {trigger.title}
                  </CardTitle>
                  {trigger.isTriggered && (
                    <Badge variant="default" className="shrink-0">
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-pretty">
                  {trigger.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phase:</span>
                    <span className="font-medium">
                      {trigger.triggerStatement.phase}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">River Basin:</span>
                    <span className="font-medium text-right text-balance">
                      {trigger.triggerStatement.riverBasin}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="font-medium">
                      {trigger.triggerStatement.source}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mandatory:</span>
                    <span className="font-medium">
                      {trigger.isMandatory ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expression:</span>
                    <span className="font-medium">
                      {trigger.triggerStatement.expression}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {triggers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No trigger statements found
            </p>
            <Link href="/add-trigger">
              <Button>Create your first trigger</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
