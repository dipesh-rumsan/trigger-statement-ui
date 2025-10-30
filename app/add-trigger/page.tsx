import { AddTriggerForm } from "@/components/add-trigger-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AddTriggerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Add Trigger</h1>
          <p className="text-muted-foreground mt-2 text-pretty">Fill the form below to create new trigger statement</p>
        </div>

        <AddTriggerForm />
      </div>
    </div>
  )
}
