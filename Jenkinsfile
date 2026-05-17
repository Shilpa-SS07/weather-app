pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                echo 'Cloning repository...'
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
                docker run -d --name weather-app-container -p 3000:5173 weather-app
                '''
            }
        }
    }
}