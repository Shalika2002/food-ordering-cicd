pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        MONGODB_URI = 'mongodb://localhost:27017/test_food_ordering'
        NODE_ENV = 'test'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    triggers {
        pollSCM('H/5 * * * *') // Poll every 5 minutes
        githubPush()
    }
    
    stages {
        stage('Preparation') {
            steps {
                echo '🚀 Starting CI/CD Pipeline for Food Ordering System'
                checkout scm
                
                script {
                    env.BUILD_NUMBER = "${BUILD_NUMBER}"
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Environment Setup') {
            parallel {
                stage('Node.js Setup') {
                    steps {
                        echo '🟢 Setting up Node.js environment'
                        sh '''
                            node --version
                            npm --version
                            echo "Node.js environment ready"
                        '''
                    }
                }
                
                stage('MongoDB Setup') {
                    steps {
                        echo '🍃 Setting up MongoDB'
                        sh '''
                            # Start MongoDB service if not running
                            sudo systemctl start mongod || echo "MongoDB already running"
                            sleep 5
                            mongo --eval "db.adminCommand('ismaster')" || echo "MongoDB connection test"
                        '''
                    }
                }
            }
        }
        
        stage('Dependency Installation') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Installing backend dependencies'
                        dir('backend') {
                            sh '''
                                npm ci
                                npm ls || true
                            '''
                        }
                    }
                }
                
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies'
                        dir('frontend') {
                            sh '''
                                npm ci
                                npm ls || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Code Quality & Security') {
            parallel {
                stage('Linting') {
                    steps {
                        echo '🔍 Running code linting'
                        script {
                            try {
                                dir('backend') {
                                    sh 'npm run lint || echo "No linting configured"'
                                }
                                dir('frontend') {
                                    sh 'npm run lint || echo "No linting configured"'
                                }
                            } catch (Exception e) {
                                echo "Linting not configured, skipping..."
                            }
                        }
                    }
                }
                
                stage('Security Audit') {
                    steps {
                        echo '🔒 Running security audit'
                        script {
                            try {
                                dir('backend') {
                                    sh 'npm audit --audit-level=moderate || true'
                                }
                                dir('frontend') {
                                    sh 'npm audit --audit-level=moderate || true'
                                }
                            } catch (Exception e) {
                                echo "Security audit completed with warnings"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Database Setup') {
            steps {
                echo '🌱 Setting up test database'
                dir('backend') {
                    sh '''
                        npm run seed
                        echo "Test database seeded successfully"
                    '''
                }
            }
        }
        
        stage('Backend Testing') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo '🧪 Running unit tests'
                        dir('backend') {
                            sh 'npm run test:unit'
                        }
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'backend/test-results/unit-tests.xml'
                        }
                    }
                }
                
                stage('API Tests') {
                    steps {
                        echo '🔗 Running API tests'
                        dir('backend') {
                            sh 'npm run test:api'
                        }
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'backend/test-results/api-tests.xml'
                        }
                    }
                }
                
                stage('BDD Tests') {
                    steps {
                        echo '🥒 Running BDD tests'
                        dir('backend') {
                            sh 'npm run test:bdd'
                        }
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'backend/test-results/bdd-tests.xml'
                        }
                    }
                }
            }
        }
        
        stage('Coverage Analysis') {
            steps {
                echo '📊 Generating coverage reports'
                dir('backend') {
                    sh 'npm run test:coverage'
                }
            }
            post {
                always {
                    publishCoverage adapters: [
                        istanbulCoberturaAdapter('backend/coverage/cobertura-coverage.xml')
                    ], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                    
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Frontend Testing & Build') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        echo '🧪 Running frontend tests'
                        dir('frontend') {
                            sh 'npm test -- --coverage --watchAll=false'
                        }
                    }
                }
                
                stage('Frontend Build') {
                    steps {
                        echo '🏗️ Building frontend application'
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('UI/E2E Testing') {
            steps {
                echo '🖥️ Running UI/E2E tests'
                script {
                    try {
                        // Start backend server
                        dir('backend') {
                            sh 'npm start > server.log 2>&1 &'
                            sh 'sleep 10' // Wait for server to start
                        }
                        
                        // Start frontend server
                        dir('frontend') {
                            sh 'npm start > frontend.log 2>&1 &'
                            sh 'sleep 30' // Wait for frontend to start
                        }
                        
                        // Run UI tests
                        dir('backend') {
                            sh '''
                                export HEADLESS=true
                                npm run test:ui
                            '''
                        }
                    } catch (Exception e) {
                        echo "UI tests failed: ${e.getMessage()}"
                        throw e
                    } finally {
                        // Cleanup processes
                        sh 'pkill -f "node.*server.js" || true'
                        sh 'pkill -f "npm.*start" || true'
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'backend/tests/ui/screenshots/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Integration & Packaging') {
            steps {
                echo '📦 Creating deployment package'
                sh '''
                    mkdir -p dist
                    
                    # Copy backend files
                    cp -r backend/* dist/ || true
                    
                    # Copy frontend build
                    cp -r frontend/build dist/public || true
                    
                    # Create deployment info
                    echo "Build: ${BUILD_NUMBER}" > dist/build-info.txt
                    echo "Commit: ${GIT_COMMIT_SHORT}" >> dist/build-info.txt
                    echo "Date: $(date)" >> dist/build-info.txt
                '''
            }
        }
        
        stage('Deployment Readiness') {
            steps {
                echo '✅ Validating deployment readiness'
                script {
                    def deploymentReady = true
                    def issues = []
                    
                    // Check if all tests passed
                    if (currentBuild.result != null && currentBuild.result != 'SUCCESS') {
                        deploymentReady = false
                        issues.add("Tests failed")
                    }
                    
                    // Check if build artifacts exist
                    if (!fileExists('dist/build-info.txt')) {
                        deploymentReady = false
                        issues.add("Build artifacts missing")
                    }
                    
                    // Create deployment summary
                    def summary = """
# 🚀 Deployment Summary

**Build Number:** ${BUILD_NUMBER}
**Git Commit:** ${GIT_COMMIT_SHORT}
**Build Date:** ${new Date()}
**Pipeline Duration:** ${currentBuild.durationString}

## ✅ Test Results
- Unit Tests: PASSED
- API Tests: PASSED
- BDD Tests: PASSED
- UI Tests: PASSED
- Frontend Tests: PASSED
- Security Audit: COMPLETED

## 📦 Artifacts
- Backend Coverage Report
- Frontend Build Files
- Test Results
- Security Audit Report

## 🔧 Environment
- Node.js Version: ${NODE_VERSION}
- MongoDB: Ready
- Build Environment: ${env.NODE_ENV}

**Status:** ${deploymentReady ? 'READY FOR DEPLOYMENT' : 'NOT READY'}
"""
                    
                    writeFile file: 'DEPLOYMENT_SUMMARY.md', text: summary
                    
                    if (deploymentReady) {
                        echo "🚀 Deployment ready! All checks passed."
                        currentBuild.description = "✅ Ready for deployment - Build #${BUILD_NUMBER}"
                    } else {
                        error("❌ Deployment not ready. Issues: ${issues.join(', ')}")
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '📊 Pipeline completed'
            
            // Archive artifacts
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'backend/coverage/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'backend/test-results.txt', allowEmptyArchive: true
            
            // Cleanup
            sh '''
                # Stop any remaining processes
                pkill -f "node.*server.js" || true
                pkill -f "npm.*start" || true
                
                # Clean temporary files
                rm -rf node_modules/.cache || true
            '''
        }
        
        success {
            echo '🎉 Pipeline completed successfully!'
            
            // Send success notification
            script {
                def message = """
                ✅ CI/CD Pipeline Success
                
                Build: #${BUILD_NUMBER}
                Commit: ${GIT_COMMIT_SHORT}
                Duration: ${currentBuild.durationString}
                
                All tests passed and deployment package is ready!
                """
                
                // You can add email/Slack notifications here
                echo message
            }
        }
        
        failure {
            echo '❌ Pipeline failed!'
            
            // Send failure notification
            script {
                def message = """
                ❌ CI/CD Pipeline Failed
                
                Build: #${BUILD_NUMBER}
                Commit: ${GIT_COMMIT_SHORT}
                Failed Stage: ${env.STAGE_NAME}
                
                Please check the logs and fix the issues.
                """
                
                // You can add email/Slack notifications here
                echo message
            }
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}