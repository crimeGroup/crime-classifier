import { THRESHOLD } from "../data/constants.js";
import { $, generateID, isValidCharCount } from "./utils.js";
export function populateExamples({ selectField, examples }) {
    examples.forEach((example, i) => {
        selectField.options.add(new Option(`Example ${i + 1}`, example));
    });
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
export function updatePredictionsField({ resultsContainer, statsContainer, results }) {
    /*
        Reset container content
        Might need to change logic if decided to animate
    */
    resultsContainer.innerHTML = "";
    let temp = "";
    results.predictions.forEach((prediction) => {
        const label = prediction.label;
        const probability = prediction.probability;
        const isAboveThreshold = prediction.probability > THRESHOLD;
        temp += `
                    <span class="label ${isAboveThreshold ? "aboveThreshold" : "belowThreshold"}" id="${label.toLowerCase()}" key="${label.toLowerCase()}">  
                        <div class="text">
                            <p>${label}</p>
                            <p>${probability}%</p>
                        </div>
                        <div class="bar-container">
                            <div class="bar" style="--initial-width: 0%; --final-width: ${probability}%; width: ${probability}%"></div>
                        </div>
                    </span> 
    
    `;
    });
    resultsContainer.innerHTML = temp;
    /* Stats */
    statsContainer.innerHTML = `
                <p id="model">Model: ${results ? results.model.name + '-' + results.model.variant : ""}</p>
                    <p id="time">Processing Time: ${results ? results.processing_time : ""} seconds</p>
    `;
}
export function updateCharCounter({ displayContainer, counterContainer, charCount }) {
    displayContainer.style.color = isValidCharCount(charCount) ? 'inherit' : 'red';
    counterContainer.innerHTML = `${String(charCount)}`;
}
export function updateInputField({ field, value }) {
    field.value = value;
}
export function toggleButtonDisable({}) {
    // radio buttons
    const disabled = false;
}
export function renderToast({ message, type }) {
    const container = $("error-container");
    if (!message) {
        container.innerHTML = "";
        return;
    }
    const template = `
        <div class="error-alert ${type}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-info"> 
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <p>${message}</p>
                    </div>
    `;
    container.innerHTML = template;
}
export function addResultToHistory({ container, result }) {
    container.innerHTML = generateHistoryItem(result) + container.innerHTML;
}
export function generateHistoryItem(result) {
    return `
    <div class="history-item" id="${generateID()}">
                <div class="header">
                    <div class="stats">
                        <p class="model">${result.model.name}-${result.model.variant}</p>
                        <p class="time">• ${result.processing_time} seconds</p>
                    </div>
                    <div class="menu">
                        <?xml version="1.0" ?><svg fill="none" height="20" viewBox="0 0 20 20" width="20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 10C6 11.1046 5.10457 12 4 12C2.89543 12 2 11.1046 2 10C2 8.89543 2.89543 8 4 8C5.10457 8 6 8.89543 6 10Z"
                                fill="#4A5568" />
                            <path
                                d="M12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10Z"
                                fill="#4A5568" />
                            <path
                                d="M16 12C17.1046 12 18 11.1046 18 10C18 8.89543 17.1046 8 16 8C14.8954 8 14 8.89543 14 10C14 11.1046 14.8954 12 16 12Z"
                                fill="#4A5568" />
                        </svg>
                    </div>
                </div>
                <div class="history-content">
                    <p> ${result.input}</p>
                    <div class="labels-container">
                    ${result.predictions.map((prediction) => {
        const probability = prediction.probability;
        const isAboveThreshold = probability > THRESHOLD;
        return `<span class="label ${isAboveThreshold ? "" : "belowThreshold"}">${prediction.label} ${probability}%</span>`;
    }).join("")}
                    </div>
                </div>
            </div>
    
    `;
}
export function setLoading(isloading) {
    const classifyBtn = $("classify-btn");
    if (!isloading) {
        classifyBtn.disabled = false;
        classifyBtn.innerHTML = "Classify";
        return;
    }
    classifyBtn.disabled = true;
    classifyBtn.innerHTML = `<span class="loader"></span> <p>Loading</p>`;
}
//# sourceMappingURL=view.js.map