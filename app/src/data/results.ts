
export type Result = {
    input: string,
    model: {
        name: ValidModel,
        variant: ValidVariant,
    },
    created_at?: string,
    predictions: Prediction[]
    processing_time: number;
}

type Prediction = {
    label: ValidLabel
    probability: number,
}

export type ValidLabel =
    "Murder" |
    "Homicide" |
    "Robbery" |
    "Physical Injuries" |
    "Rape" |
    "Theft" |
    "Carnapping" |
    "Others"

export type ValidModel = "bert" | "xlnet"
export type ValidVariant = "finetuned" | "pretrained"

export const LABELS = [
    "Murder",
    "Homicide",
    "Robbery",
    "Physical Injuries",
    "Rape",
    "Theft",
    "Carnapping",
    "Others"
]