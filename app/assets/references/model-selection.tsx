import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CircuitBoard, Network, Cog, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModelVariant {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface ModelOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  variants: ModelVariant[]
}

const modelOptions: ModelOption[] = [
  {
    id: "bert",
    name: "BERT",
    description: "Bidirectional Encoder Representations from Transformers",
    icon: <CircuitBoard className="h-12 w-12" />,
    variants: [
      {
        id: "bert-pretrained",
        name: "Pre-trained",
        description: "General-purpose BERT model",
        icon: <Cog className="h-6 w-6" />,
      },
      {
        id: "bert-finetuned",
        name: "Fine-tuned",
        description: "BERT model optimized for specific tasks",
        icon: <Wrench className="h-6 w-6" />,
      },
    ],
  },
  {
    id: "xlnet",
    name: "XLNet",
    description: "Generalized Autoregressive Pretraining for Language Understanding",
    icon: <Network className="h-12 w-12" />,
    variants: [
      {
        id: "xlnet-pretrained",
        name: "Pre-trained",
        description: "General-purpose XLNet model",
        icon: <Cog className="h-6 w-6" />,
      },
      {
        id: "xlnet-finetuned",
        name: "Fine-tuned",
        description: "XLNet model optimized for specific tasks",
        icon: <Wrench className="h-6 w-6" />,
      },
    ],
  },
]

export default function GraphicalModelSelectorWithVariants({
  onModelChange,
}: {
  onModelChange: (model: string, variant: string) => void
}) {
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const handleModelSelect = (modelId: string) => {
    const model = modelOptions.find((m) => m.id === modelId) || null
    setSelectedModel(model)
    setSelectedVariant(null)
  }

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId)
    if (selectedModel) {
      onModelChange(selectedModel.id, variantId)
    }
  }

  const resetSelection = () => {
    setSelectedModel(null)
    setSelectedVariant(null)
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Text Classifier Model</CardTitle>
        <CardDescription>Select a model and variant for text classification</CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedModel ? (
          <RadioGroup onValueChange={handleModelSelect} className="grid grid-cols-2 gap-4">
            {modelOptions.map((option) => (
              <div key={option.id}>
                <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                <Label
                  htmlFor={option.id}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {option.icon}
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Selected Model: {selectedModel.name}
              </h3>
              <Button variant="outline" size="sm" onClick={resetSelection}>
                Change Model
              </Button>
            </div>
            <RadioGroup onValueChange={handleVariantSelect} className="grid grid-cols-2 gap-4">
              {selectedModel.variants.map((variant) => (
                <div key={variant.id}>
                  <RadioGroupItem value={variant.id} id={variant.id} className="peer sr-only" />
                  <Label
                    htmlFor={variant.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    {variant.icon}
                    <div className="mt-4 text-center">
                      <h4 className="font-semibold">{variant.name}</h4>
                      <p className="text-sm text-muted-foreground">{variant.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </>
        )}
      </CardContent>
    </Card>
  )
}