pipeline {
    agent any

    environment {
        VITE_WEATHER_API_KEY = credentials('weather-api-key')
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/Shilpa-SS07/weather-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '''
                docker build ^
                --build-arg VITE_WEATHER_API_KEY=%VITE_WEATHER_API_KEY% ^
                -t weather-app .
                '''
            }
        }

        stage('Run Container') {
            steps {
                bat '''
                docker rm -f weather-app-container || exit 0
                docker run -d --name weather-app-container -p 3000:3000 weather-app
                '''
            }
        }
    }
}