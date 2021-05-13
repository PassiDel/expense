pipeline {
    agent any

    tools {
        nodejs '15.14.0'
    }

    stages {
        stage ('Initialize') {
            steps {
                echo 'Initializing..'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Archive') {
            when {
              branch 'master'
              expression {
                currentBuild.result == null || currentBuild.result == 'SUCCESS'
              }
            }
            steps {
                echo 'Archiving....'

                dir("dist") {
                    sh 'git init'
                    sh 'git add .'
                    sh 'git config --global user.email "jenkins@bosym.de"'
                    sh 'git config --global user.name "Jenkins"'
                    sh 'git commit -m "Deploy by Jenkins"'
                    withCredentials([usernamePassword(credentialsId: 'f9aaa85c-5f26-4e5c-82fa-1c05127a6648', usernameVariable: 'username', passwordVariable: 'password')])
                    {
                        sh "git push --force --quiet \"https://$username:$password@git.syma.dev/Pascal/expense.git\" master:gh-pages"
                    }
                }

                deleteDir()
            }
        }
    }
}
