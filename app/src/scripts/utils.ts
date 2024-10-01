import { MAX_CHARS, MIN_CHARS } from "../data/constants.js";
import { LABELS, Result, ValidLabel } from "../data/types.js";

export function getRandomNumber(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** shortcut for get element by ID */
export function $(id: string) {
    return document.getElementById(id);
}

export function formatPercentage(percent: number): number {
    return Number(percent.toFixed(2)) * 100;
}

export function isValidCharCount(charCount: number): boolean {

    return charCount <= MAX_CHARS && charCount >= MIN_CHARS;
}

export function initializeResults(): Result {

    const predictions = LABELS.map((label) => {
        return {
            label: label as ValidLabel,
            probability: 0
        }
    })

    return {
        input: "",
        model: {
            name: "",
            variant: "",
        },
        predictions,
        processing_time: 0
    }
}

export function generateMockResult({ init }: { init?: boolean }): Result {

    const predictions = LABELS.map((label) => {
        return {
            label: label as ValidLabel,
            probability: init ? 0 : getRandomNumber(1, 1000) / 1000
        }
    }).sort((a, b) => b.probability - a.probability)

    return {
        input: "sample input",
        model: "bert",
        predictions
    }
}

export function generateID(): number {
    return Date.now();
}


export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



