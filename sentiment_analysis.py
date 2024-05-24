from transformers import pipeline
import json 


with open('news_dataset.json', 'r') as f:
    data = json.load(f)

# Hugging Face Sentiment Analysis Model
model_path = "finiteautomata/bertweet-base-sentiment-analysis"
sentiment_task = pipeline("sentiment-analysis", model=model_path, tokenizer= model_path)

# Iterate over each object in json file
for entry in data:
    # Extract description 
    description = entry['short_description']
    # Perform sentiment analysis
    result = sentiment_task(description)
    result.append({
        "headline": entry["headline"],
        "sentiment": result[0]["label"],
        "confidence": result[0]["score"]
    })

    # print(result)
# fix these lines of code and why it doesn't write properly
    # Path for sentiment results file 
file_path = "sentiment_results.json"
    # Write sentiment analysis results to JSON file
with open(file_path, 'w') as file:
    json.dump(result, file, indent=4)
         
   
   

