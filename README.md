

# News Aggregator and Sentiment Analysis API

This project performs sentiment analysis on news articles using the Hugging Face Transformer AI model. It features user authentication, database management, and API endpoints to interact with the data.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Sentiment Analysis](#sentiment-analysis)
- [Tools and Languages](#tools-and-languages)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: Register and login users with hashed passwords.
- **Database Management**: Store and retrieve news articles and user profiles.
- **Sentiment Analysis**: Analyze sentiments of news articles using the Hugging Face `bertweet-base-sentiment-analysis` model.

## Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/news-aggregator-sentiment-analysis.git
    cd news-aggregator-sentiment-analysis
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up the database:**
    - Ensure you have MySQL installed and running.
    - Create the necessary databases: `news_database` and `user_database`.

4. **Configure the databases in your project:**
    Update the database configuration in the respective files:
    ```javascript
    const sequelize = new Sequelize('database_name', 'username', 'password', {
      host: 'localhost',
      dialect: 'mysql'
    });
    ```

5. **Run the application:**
    ```bash
    npm run dev
    ```

## Usage
- **Homepage**: `GET /` - Welcome message.
- **User Management**: Register and login users.
- **Database Operations**: View and interact with news articles stored in the database.
- **Sentiment Analysis**: View sentiment analysis results for news articles.

## API Endpoints
### User Authentication
- **List Users**: `GET /users`
- **Create User**: `POST /users`
- **Login User**: `POST /login`
- **Generate API Key**: `POST /generate-api-key`

### News Database
- **View All News Articles**: `GET /database`
- **View Specific Column**: `GET /database/column?column=column_name`
- **Filter/Group by Category**: `GET /database/column/category?category=category_name`
- **Look Up Headlines**: `GET /database/headline?headline=some_headline`
- **Look Up Author**: `GET /database/author?author=author_name`
- **Filter News by Date**: `GET /database/date?date=YYYY-MM-DD`

### Sentiment Analysis
- **View Sentiment Analysis Results**: `GET /sentiment/headline?headline=some_headline`

## Database Schema
### News Data Model
```javascript
class newsData extends Model{}
newsData.init({
    Category: { type: DataTypes.STRING, allowNull: false },
    Headline: { type: DataTypes.STRING, allowNull: false },
    Authors: { type: DataTypes.STRING }
});
```

### User Data Model
```javascript
class User extends Model{}
User.init({
    userName: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, {
    freezeTableName: true,
    instanceMethods: {
        generateHash(password) { return bcrypt.hash(password, bcrypt.genSaltSync(10)); },
        validPassword(password) { return bcrypt.compare(password, this.password); }
    }
});
```

## Sentiment Analysis
The sentiment analysis feature in this project utilizes the Hugging Face `bertweet-base-sentiment-analysis` model. This model is designed to analyze textual data and determine the sentiment conveyed in the text, categorizing it as positive, negative, or neutral.

### Integration of AI Model
1. **Data Preparation**: The project reads news articles from a JSON dataset. Each article's text is extracted for sentiment analysis.
2. **Model Loading**: The `bertweet-base-sentiment-analysis` model from Hugging Face is loaded using the `transformers` library in Python. This model is pre-trained for sentiment analysis tasks.
3. **Sentiment Analysis**: The text of each article is fed into the model, which returns a sentiment label (positive, negative, or neutral) along with a confidence score.
4. **Results Storage**: The sentiment analysis results, including the headline, sentiment label, and confidence score, are stored in a JSON file and can be queried via API endpoints.

By integrating this AI model, the project can provide insights into the general sentiment of news articles, helping users understand the tone and emotional impact of the content they are reading.

## Tools and Languages
- **Programming Languages**: JavaScript, Python
- **Backend Framework**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **AI Model**: Hugging Face `bertweet-base-sentiment-analysis`
- **Libraries**: 
  - **Node.js**: bcrypt for password hashing, fs for file system operations, jsonwebtoken for JWT management, nodemon for development
  - **Python**: transformers for sentiment analysis, json for JSON parsing
- **Development Tools**: Git for version control

## Project Structure
```
news_aggregator_api/
├── authController/
│   ├── authRouter.js
│   ├── file.txt
│   └── user.js
├── newsController/
│   ├── News_Category_Dataset_v3.json
│   ├── json_converter.py
│   └── news_database.js
│   ├── news_dataset.json
├── sentimentController/
│   ├── sentiment.js
│   ├── sentiment_analysis.py
│   └── sentiment_results.json
├── .gitignore
├── README.md
├── package-lock.json
├── package.json
└── server.js
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss potential changes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


