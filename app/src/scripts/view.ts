import { THRESHOLD } from "../data/constants.js";
import { Result } from "../data/results.js";
import { $, isValidCharCount } from "./utils.js";

export function populateExamples({ selectField, examples }: { selectField: HTMLSelectElement, examples: string[] }) {
    examples.forEach((example, i) => {
        selectField.options.add(new Option(`Example ${i + 1}`, example))
    })
}

/* TODO 

    REQUIRED
    - change values of labels 

    OPTIONAL
    - on load animation 
    - change numbers 
    - animate bars 
    - animate percentage 

  */
export function updatePredictionsField({ resultsContainer, statsContainer, results }: { predictionErrorContainer?: HTMLDivElement, resultsContainer: HTMLDivElement, statsContainer: HTMLDivElement, results: Result }): void {

    /* 
        Reset container content 
        Might need to change logic if decided to animate
    */
    resultsContainer.innerHTML = "";

    let temp: string = "";

    results.predictions.forEach((prediction) => {

        const label = prediction.label;
        const probability = prediction.probability;
        const isAboveThreshold = prediction.probability > THRESHOLD;

        temp += `
                    <span class="label" id="${label.toLowerCase()}" key="${label.toLowerCase()}" style="opacity: ${!isAboveThreshold ? 0.5 : 1}">  
                        <div class="text">
                            <p>${label}</p>
                            <p>${probability}%</p>
                        </div>
                        <div class="bar-container">
                            <div class="bar" style="--initial-width: 0%; --final-width: ${probability}%; width: ${probability}%"></div>
                        </div>
                    </span> 
    
    `

    })

    resultsContainer.innerHTML = temp;

    /* Stats */

    statsContainer.innerHTML = `
                <p id="model">Model: ${results ? results.model.name + '-' + results.model.variant : ""}</p>
                    <p id="time">Processing Time: ${results ? results.processing_time : ""} seconds</p>
    `


}

export function updateCharCounter({ displayContainer, counterContainer, charCount }: { displayContainer: HTMLDivElement, counterContainer: HTMLSpanElement, charCount: number }): void {
    displayContainer.style.color = isValidCharCount(charCount) ? 'inherit' : 'red';
    counterContainer.innerText = String(charCount);
}


export function updateInputField({ field, value }: { field: HTMLTextAreaElement, value: string }): void {
    field.value = value;
}

export function toggleButtonDisable({ }): void {
    // radio buttons
    const disabled: boolean = false;
}

export function renderToast({ message, type }: { message: string, type: "info" | "error" }): void {

    const container = $("error-container") as HTMLDivElement;

    if (!message) {
        container.innerHTML = ""
        return;
    }

    const template = `
        <div class="error-alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-info"> 
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <p>${message}</p>
                    </div>
    `

    container.innerHTML = template;

    const toast = document.querySelector(".error-alert") as HTMLDivElement;

    const toastType = {
        "error": {
            border: "1px solid red",
            backgroundColor: "rgb(255, 157, 157)",
            color: "rgb(109, 5, 5)"
        },
        "info": {
            border: "1px solid blue",
            backgroundColor: "rgb(157, 175, 255)",
            color: "rgb(5, 53, 109)"
        }
    }

    toast.style.border = toastType[type].border;
    toast.style.backgroundColor = toastType[type].backgroundColor;
    toast.style.color = toastType[type].color;
}

