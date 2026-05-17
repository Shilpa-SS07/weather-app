pipeline {
    agent any

    environment {
        VITE_API_KEY = credentials('weather-api-key')
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Shilpa-SS07/weather-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t weather-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat '''
                docker rm -f weather-app-container 2>nul
                docker run -d --name weather-app-container -p 3000:5173 -e VITE_API_KEY=%VITE_API_KEY% weather-app
                '''
            }
        }
    }
}