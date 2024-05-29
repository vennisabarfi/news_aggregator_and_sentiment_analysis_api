from transformers import pipeline
import json 
import os


with open('news_dataset.json', 'r') as f:
    data = json.load(f)

# Hugging Face Sentiment Analysis Model
model_path = "finiteautomata/bertweet-base-sentiment-analysis"
sentiment_task = pipeline("sentiment-analysis", model=model_path, tokenizer= model_path)

# Iterate over each object in json file
results = []
for entry in data:
    # Extract description 
    description = entry['short_description']
    # Perform sentiment analysis
    sentiment_result = sentiment_task(description)[0]
    # json structure
    results.append({
        "headline": entry["headline"],
        "sentiment": sentiment_result["label"],
        "confidence": sentiment_result["score"]
    })

    file_path = "sentiment_results.json"
    # retrieve current directory
    home_dir = os.getcwd()
    # write to file in directory in json format
    with open(os.path.join(home_dir, file_path), 'w') as f:
        json.dump(results, f, indent=4)    


   

