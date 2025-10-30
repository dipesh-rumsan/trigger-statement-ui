"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
// import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type SourceType =
  | "water_level_m"
  | "discharge_m3s"
  | "rainfall_mm"
  | "prob_flood"
  | "";

type OperatorType = ">" | "<" | "=" | ">=" | "<=";

interface TriggerFormData {
  triggerType: "automated" | "manual";
  phase: string;
  riverBasin: string;
  title: string;
  description: string;
  source: SourceType;
  sourceSubType: string;
  operator: OperatorType | "";
  value: string;
  repeatKey: string;
  repeatEvery: string;
  notes: string;
  isMandatory: boolean;
  isTriggered: boolean;
}

const sourceOptions: Record<SourceType, { label: string; sourceSubType: string; subTypes: string[] }> =
{
  water_level_m: {
    label: 'DHM Water Level',
    sourceSubType: "Water Level (m)",
    subTypes: ["warning_level", "danger_level"],
  },
  discharge_m3s: {
    label: "GFH",
    sourceSubType: "Discharge (m³/s)",
    subTypes: ["warning_discharge", "danger_discharge"],
  },
  rainfall_mm: {
    label: "DHM Rainfall",
    sourceSubType: "Rainfall (mm)",
    subTypes: ["hourly", "daily"],
  },
  prob_flood: {
    label: "Glofas",
    sourceSubType: "Flood Probability",
    subTypes: ["2_years_max_prob", "5_years_max_prob", "20_years_max_prob"],
  },
  "": { label: "", sourceSubType: "", subTypes: [] },
};

const operators: { value: OperatorType; label: string }[] = [
  { value: ">", label: "Greater than (>)" },
  { value: "<", label: "Less than (<)" },
  { value: "=", label: "Equals (=)" },
  { value: ">=", label: "Greater than or equal (≥)" },
  { value: "<=", label: "Less than or equal (≤)" },
];

const createTrigger = async (payload: any) => {
  const response = await axios.post(
    "http://localhost:8000/v1/triggers",
    payload,
  );
  return response.data;
};

export function AddTriggerForm() {
  const router = useRouter();
  // const { toast } = useToast();
  const [formData, setFormData] = useState<TriggerFormData>({
    triggerType: "automated",
    phase: "",
    riverBasin: "",
    title: "",
    description: "",
    source: "",
    sourceSubType: "",
    operator: "",
    value: "",
    repeatKey: "",
    repeatEvery: "",
    notes: "",
    isMandatory: false,
    isTriggered: false,
  });

  const { mutate: createTriggerMutation } = useMutation({
    mutationFn: createTrigger,
    onSuccess: () => {
      toast.success("Trigger created successfully");
      router.push("/");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to create trigger", {
        description: error?.response?.data?.detail,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate expression for expr-eval
    const expression = `${formData.sourceSubType} ${formData.operator} ${formData.value}`;

    const payload = {
      repeatKey: formData.repeatKey,
      repeatEvery: formData.repeatEvery,
      triggerStatement: JSON.stringify({
        source: formData.source,
        sourceSubType: formData.sourceSubType,
        operator: formData.operator,
        value: Number.parseFloat(formData.value),
        expression: expression,
        riverBasin: formData.riverBasin,
        phase: formData.phase,
      }),
      triggerDocuments: undefined,
      notes: formData.notes,
      title: formData.title,
      description: formData.description,
      isMandatory: formData.isMandatory,
      isTriggered: formData.isTriggered,
      isDeleted: false,
    };

    await createTriggerMutation(payload);
  };

  const handleClear = () => {
    setFormData({
      triggerType: "automated",
      phase: "",
      riverBasin: "",
      title: "",
      description: "",
      source: "",
      sourceSubType: "",
      operator: "",
      value: "",
      repeatKey: "",
      repeatEvery: "",
      notes: "",
      isMandatory: false,
      isTriggered: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Select Trigger Type</CardTitle>
          <CardDescription className="text-pretty">
            Select trigger type and fill the details below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trigger Type Tabs */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={
                formData.triggerType === "automated" ? "default" : "outline"
              }
              onClick={() =>
                setFormData({ ...formData, triggerType: "automated" })
              }
            >
              Automated trigger
            </Button>
            <Button
              type="button"
              variant={
                formData.triggerType === "manual" ? "default" : "outline"
              }
              onClick={() =>
                setFormData({ ...formData, triggerType: "manual" })
              }
            >
              Manual trigger
            </Button>
          </div>

          {/* Phase and River Basin */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phase">Phase</Label>
              <Input
                id="phase"
                placeholder="READINESS"
                value={formData.phase}
                onChange={(e) =>
                  setFormData({ ...formData, phase: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="riverBasin">River Basin</Label>
              <Input
                id="riverBasin"
                placeholder="Doda river at east-west highway"
                value={formData.riverBasin}
                onChange={(e) =>
                  setFormData({ ...formData, riverBasin: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Trigger Title and Source */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Trigger Title</Label>
              <Input
                id="title"
                placeholder="Enter Trigger Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value: SourceType) =>
                  setFormData({
                    ...formData,
                    source: value,
                    sourceSubType: "",
                    operator: "",
                    value: "",
                  })
                }
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sourceOptions)
                    .filter(([key]) => key !== "")
                    .map(([key, { label, sourceSubType }]) => (
                      <SelectItem key={key} value={key}>
                        {label} - {sourceSubType}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dynamic Fields Based on Source */}
          {formData.source && (
            <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="sourceSubType">
                  {formData.source === "water_level_m" && "Level Type"}
                  {formData.source === "discharge_m3s" && "Discharge Type"}
                  {formData.source === "rainfall_mm" && "Measurement Period"}
                  {formData.source === "prob_flood" && "Probability Period"}
                </Label>
                <Select
                  value={formData.sourceSubType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sourceSubType: value })
                  }
                >
                  <SelectTrigger id="sourceSubType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions[formData.source].subTypes.map((subType) => (
                      <SelectItem key={subType} value={subType}>
                        {subType
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.sourceSubType && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="operator">Operator</Label>
                    <Select
                      value={formData.operator}
                      onValueChange={(value: OperatorType) =>
                        setFormData({ ...formData, operator: value })
                      }
                    >
                      <SelectTrigger id="operator">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      placeholder="Enter value"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      required
                    />
                  </div>

                  {formData.operator && formData.value && (
                    <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                      <p className="text-sm font-medium text-primary">
                        Generated Expression:
                      </p>
                      <code className="text-sm font-mono">
                        {formData.source}  {formData.operator}{" "}
                        {formData.sourceSubType} ({formData.value})
                      </code>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Trigger Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Trigger description</Label>
            <Textarea
              id="description"
              placeholder="Write trigger description here"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          {/* Repeat Configuration */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="repeatKey">Repeat Key</Label>
              <Input
                id="repeatKey"
                placeholder="e.g., daily, weekly"
                value={formData.repeatKey}
                onChange={(e) =>
                  setFormData({ ...formData, repeatKey: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeatEvery">Repeat Every</Label>
              <Input
                id="repeatEvery"
                placeholder="e.g., 1, 2, 3"
                value={formData.repeatEvery}
                onChange={(e) =>
                  setFormData({ ...formData, repeatEvery: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes (optional)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isMandatory" className="cursor-pointer">
                Mandatory Trigger
              </Label>
              <Switch
                id="isMandatory"
                checked={formData.isMandatory}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isMandatory: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isTriggered" className="cursor-pointer">
                Is Triggered
              </Label>
              <Switch
                id="isTriggered"
                checked={formData.isTriggered}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isTriggered: checked })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button type="submit" size="lg">
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
