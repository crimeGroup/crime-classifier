import { fetchResults } from "./scripts/api.js";
import examples from "./data/examples.js";
import { $, delay, initializeResults, isValidCharCount } from "./scripts/utils.js";
import { addResultToHistory, populateExamples, renderToast, setLoading, updateCharCounter, updateInputField, updatePredictionsField } from "./scripts/view.js";
import { MAX_CHARS, MIN_CHARS, THRESHOLD } from "./data/constants.js";
const BASE_URL = `http://localhost:8080/api/v1/crimes/classify`;
/* TODO

    - flask backend
    -

*/
document.addEventListener("DOMContentLoaded", () => {
    const inputField = $("input-field");
    const displayContainer = $("char-counter");
    const counterContainer = $("current-char-count");
    const exampleSelector = $("example-selector");
    const form = $("form");
    const classifyBtn = $("classify-btn");
    const resultsContainer = $("labels");
    const statsContainer = $("stats");
    const radios = document.querySelectorAll('input[type="radio"]');
    const predictionErrorContainer = $("prediction-error");
    const historyContainer = $("history-container");
    function INITIALIZE() {
        updatePredictionsField({ resultsContainer, statsContainer, results: initializeResults() });
        populateExamples({ selectField: exampleSelector, examples });
    }
    async function batchClassify(batchText, model, variant) {
        const paragraphs = batchText.split("\n");
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            const formInput = {
                input: paragraph,
                model: model,
                variant: variant,
            };
            setLoading(true);
            try {
                renderToast({
                    message: `Processing paragraphs ${i + 1} / ${paragraphs.length}`,
                    type: "info"
                });
                if (!isValidCharCount(paragraph.length)) {
                    console.log(`Characters: ${paragraph.length}\nParagraph must be ${MIN_CHARS} - ${MAX_CHARS} characters. Skipping paragraph...`);
                    renderToast({
                        message: `Paragraph must be ${MIN_CHARS} - ${MAX_CHARS} characters. Skipping paragraph ${i + 1} / ${paragraphs.length}...`,
                        type: "info"
                    });
                    await delay(2000);
                    continue;
                }
                const data = await fetchResults(BASE_URL, formInput);
                console.log("Data: ", data);
                updatePredictionsField({ predictionErrorContainer, resultsContainer, statsContainer, results: data });
                if (!data.predictions.some((prediction) => prediction.probability > THRESHOLD)) {
                    renderToast({
                        message: "No crime labels detected. Please ensure input contains detailed information such as date, time, location, nature, or description of the crime.",
                        type: "info"
                    });
                }
                addResultToHistory({ container: historyContainer, result: data });
            }
            catch (error) {
                console.log("Classification error:", error);
                renderToast({ message: error.message, type: "error" });
                setLoading(false);
            }
        }
        renderToast({
            message: "Batch classification completed.",
            type: "info"
        });
        setLoading(false);
    }
    INITIALIZE();
    /* Event listeners */
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    radios.forEach((radio) => {
        radio.checked = false;
        radio.addEventListener("change", () => {
            const variantSelector = $("variant-selector");
            if (radio.checked)
                variantSelector.style.display = "flex";
            console.log(document.querySelector('input[name="model"]:checked'));
            console.log(document.querySelector('input[name="variant"]:checked'));
        });
    });
    inputField.addEventListener("input", () => {
        updateCharCounter({ displayContainer, counterContainer, charCount: inputField.value.length });
    });
    classifyBtn.addEventListener("click", async () => {
        console.log("submeet");
        const inputText = inputField.value;
        console.log(inputText.split("\n"));
        renderToast({
            message: "",
            type: "info"
        });
        /* Validate if values exist */
        if (!document.querySelector('input[name="model"]:checked')) {
            alert("Please select classifier model (BERT or XLNet)");
            return;
        }
        if (!document.querySelector('input[name="variant"]:checked')) {
            alert("Please select model variant (Pre-trained or Fine-tuned)");
            return;
        }
        /* Get form values */
        const model = document.querySelector('input[name="model"]:checked');
        const variant = document.querySelector('input[name="variant"]:checked');
        if (inputText.split("\n").length > 1) {
            batchClassify(inputText, model.value, variant.value);
            return;
        }
        if (!isValidCharCount(inputText.length)) {
            alert(`Characters: ${inputText.length}\n\nInput must be ${MIN_CHARS} - ${MAX_CHARS} characters.`);
            return;
        }
        const formInput = {
            input: inputText,
            model: model.value,
            variant: variant.value,
        };
        console.log("Model: ", formInput.model);
        /* Send input values to the server */
        try {
            setLoading(true);
            renderToast({
                message: "Classifying text...",
                type: "info"
            });
            const data = await fetchResults(BASE_URL, formInput);
            console.log("Data: ", data);
            // updatePredictionsField({ container: resultsContainer, results: generateMockResult({ init: false }) })
            updatePredictionsField({ predictionErrorContainer, resultsContainer, statsContainer, results: data });
            /* If any label exceeds threshold (50%) */
            if (!data.predictions.some((prediction) => prediction.probability > THRESHOLD)) {
                renderToast({
                    message: "No crime labels detected. Please ensure input contains detailed information such as date, time, location, nature, or description of the crime.",
                    type: "info"
                });
            }
            addResultToHistory({ container: historyContainer, result: data });
            setLoading(false);
            renderToast({
                message: "",
                type: "info"
            });
        }
        catch (error) {
            console.log("Classification error:", error);
            renderToast({ message: error.message, type: "error" });
            setLoading(false);
            renderToast({
                message: "",
                type: "info"
            });
        }
    });
    exampleSelector.addEventListener("input", (e) => {
        updateInputField({ field: inputField, value: exampleSelector.value });
        updateCharCounter({ displayContainer, counterContainer, charCount: inputField.value.length });
    });
});
//# sourceMappingURL=app.js.map