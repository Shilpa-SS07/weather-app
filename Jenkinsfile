pipeline {
    agent any

    environment {
        VITE_WEATHER_API_KEY = credentials('weather-api-key')
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://your-repo-url.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t weather-app .'
            }
        }

        stage('Run Container') {
            steps {
                bat '''
                docker rm -f weather-app-container || exit 0
                docker run -d --name weather-app-container -p 3000:5173 -e VITE_WEATHER_API_KEY=%VITE_WEATHER_API_KEY% weather-app
                '''
            }
        }
    }
}