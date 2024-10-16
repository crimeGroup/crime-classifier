import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import pandas as pd
import time  
import random
import re

def preprocess(text):
    # Convert to lowercase
    text = re.sub(r'[A-Z]', lambda y: y.group(0).lower(), text)
    
    # Remove unimportant links
    text = re.sub(r'http[s]?://\S+', '', text)

    # Remove emojis (non-ASCII characters)
    text = re.sub(r'[^\x00-\x7F]+', '', text)

    # Remove usernames (mentions)
    text = re.sub(r'@\w+', '', text)

    # Remove punctuations and replace with space
    text = re.sub(r'[^\w\s]', ' ', text)

    # Remove hashtags (keeping the text but removing the # symbol)
    text = re.sub(r'#', '', text)
    
    return text

MODEL_NAMES = {
    "bert": 'google-bert/bert-base-uncased',
    "xlnet": 'xlnet/xlnet-base-cased',
}

MODEL_VARIANTS = {
    "bert-pretrained": 'cc-bert-pretrained-model.pth',
    "xlnet-pretrained": 'cc-xlnet-pretrained-model.pth',
    "bert-finetuned": 'cc-bert-finetuned-model.pth',
    "xlnet-finetuned": 'cc-xlnet-finetuned-model.pth',
}

MODEL_DIR = "./source/models" 

LABELS = [

    'Murder',
    'Homicide',
    'Robbery',
    'Physical Injuries',
    'Rape',
    'Theft',
    'Carnapping',
    'Others'
]

THRESHOLD = 0.5

class BERTCrimeClassifier(nn.Module):
    def __init__(self, model_name, batch_size=8, epochs=5, dropout=0.1):
        super(BERTCrimeClassifier, self).__init__()
        self.model = AutoModel.from_pretrained(model_name)
        self.hidden_linear = nn.Linear(self.model.config.hidden_size, self.model.config.hidden_size) 
        self.dropout = nn.Dropout(dropout)
        self.linear = nn.Linear(self.model.config.hidden_size, len(LABELS))

    def forward(self, ids, mask):
        bert_outputs = self.model(ids, attention_mask=mask)
        cls_hidden_state = bert_outputs.last_hidden_state[:, 0, :] 
        hidden_output = self.hidden_linear(cls_hidden_state) 
        dropped_out = self.dropout(hidden_output)  
        logits = self.linear(dropped_out)  
        return logits


class XLNetCrimeClassifier(nn.Module):
    def __init__(self, model_name, sbatch_size=8,epochs=5, dropout=0.1): 
        super(XLNetCrimeClassifier, self).__init__()
        self.model = AutoModel.from_pretrained(model_name)
        self.dropout = nn.Dropout(dropout)
        self.linear = nn.Linear(self.model.config.hidden_size, len(LABELS))

    def forward(self, ids, mask):
        bert_outputs = self.model(ids, attention_mask=mask)
        cls_hidden_state = bert_outputs.last_hidden_state[:, 0, :] 
        dropped_out = self.dropout(cls_hidden_state)
        logits = self.linear(dropped_out)
        return logits



bertCrimeClassifier = BERTCrimeClassifier('google-bert/bert-base-uncased')
xlnetCrimeClassifier = XLNetCrimeClassifier('xlnet/xlnet-base-cased')

print(bertCrimeClassifier)
print(xlnetCrimeClassifier)


# Global cache para i-store ang mga loaded na models
model_cache = {}

def get_model(model_id, model_variant):
    model_name = MODEL_NAMES[model_id]
    model_path = f'{MODEL_DIR}/{model_id}-{model_variant}/{MODEL_VARIANTS[f"{model_id}-{model_variant}"]}'

    cache_key = f"{model_id}-{model_variant}"

    if cache_key in model_cache:
        print(f"Using cached model: {cache_key}")
        return model_cache[cache_key]
    
    if model_id == "bert":
        crimeClassifier = BERTCrimeClassifier(model_name)
    elif model_id == "xlnet": 
        crimeClassifier = XLNetCrimeClassifier(model_name)

    # Load pre-trained weights
    crimeClassifier.load_state_dict(torch.load(model_path))

    crimeClassifier.eval()

    model_cache[cache_key] = crimeClassifier

    print(f"Model loaded and cached: {cache_key}")
    return crimeClassifier

def get_predictions(input_text, model_id, model_variant):

    crimeClassifier = get_model(model_id, model_variant)

    # Tokenizer
    model_name = MODEL_NAMES[model_id]
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    # Classification
    start_time = time.time()  # Start the timer

    preprocessed_text = preprocess(input_text)

    # Encode text
    encoded_input_text = tokenizer(preprocessed_text, padding="max_length", truncation=True, max_length=128, return_tensors='pt')

    # Get raw results
    with torch.no_grad():
        logits = crimeClassifier(ids=encoded_input_text['input_ids'], mask=encoded_input_text['attention_mask'])

    # Apply activation to get probabilities
    predictions = logits.flatten().sigmoid()

    label_probabilities = [{"label": label, "probability": float(round(prob.item() * 100, 2))} for label, prob in zip(LABELS, predictions)]

    # Sort label probabilities in descending order
    label_probabilities = sorted(label_probabilities, key=lambda item: -item["probability"])

    # Labels greater than 0.5 threshold
    predicted_labels = [(label, f"{pred*100:.2f}%") for label, pred in zip(LABELS, predictions) if pred >= THRESHOLD]
    
    end_time = time.time()  # End the timer
    duration = round(end_time - start_time, 4)  # Calculate the duration


    # Display results
   
    print("Input: " + input_text)
    print()
    print("Predicted Labels:")
    for label, probability in predicted_labels:
        print(f"({label}, {probability})")
    print()
    for result in label_probabilities: 
        print(f"{result['label']}: {result['probability']}")

    print(f"\nPrediction processing time: {duration:.4f} seconds")

    return {
        "input": input_text,
        "model": {
            "name": model_id,
            "variant": model_variant
            },
        "predictions": label_probabilities,
        "processing_time": duration
    }     # Return both the predictions and the processing time





