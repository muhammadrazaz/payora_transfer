# 🚗 AAB Automobile Buy/Sell Platform Backend

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=launchpadapps-au_ask-auto-bee-backend&metric=alert_status&token=b8ef819cf0affff318a3f24b2e9799b4f3e0b099)](https://sonarcloud.io/summary/new_code?id=launchpadapps-au_ask-auto-bee-backend)

This project is the backend for an automobile buy/sell platform, built using Node.js with Express. It is designed to support various user platforms including customers, admins, dealerships, and individual dealers.

## 🌟 Features

- **🔗 Webhook Integration**: Incorporates a webhook to receive car listing updates from a third-party API.
- **📧 Email Notifications**: Utilizes SendGrid for sending email notifications.
- **🎥 Automated Video Generation**: Includes a cron job for automatically generating videos.
- **👥 Multi-Platform Support**: Provides backend services for four different user platforms:
  - Customer
  - Admin
  - Dealership
  - Dealer

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Docker 🐳
- AWS Account (for deployment) ☁️
- SendGrid Account

### Installing

A step by step series of examples that tell you how to get a development environment running.

1. **Clone the repository:** 📋
   ```
   git clone https://github.com/launchpadapps-au/ask-auto-bee-backend.git
   ```
2. **Navigate to the project directory:** 📁
   ```
   cd automobile-platform
   ```
3. **Install dependencies:** 📦
   ```
   npm install
   ```
4. **Set up environment variables:** 🔑
   - Create a `.env` file in the root directory.
   - Add necessary variables like SendGrid API keys, AWS credentials, etc.

5. **Run the application:** 🏃
   ```
   npm start
   ```

### Running the tests

Explain how to run the automated tests for this system. 🧪

## 🌐 Deployment

This project is configured with a CI/CD pipeline using GitHub Actions, which automates the deployment process on AWS EC2 instances using Docker.

### Workflow

- **GitHub Actions**: Any direct commit or merge to the master branch triggers the GitHub Actions workflow. 🔄
- **Docker Image Creation**: The workflow creates a Docker image of the application. Secrets such as environment variables and API keys are securely fetched from the GitHub Secrets section.
- **Docker Hub Push**: After the image is built, it is pushed to Docker Hub. 📤
- **AWS Deployment**: The workflow then logs into AWS, pulls the latest Docker image from Docker Hub, and runs it as a container on an EC2 instance. 🚢

### Steps for Manual Deployment

1. **Build the Docker Image:** 🐳
   ```
   docker build -t launchpadapps/aab-backend-v1 .
   ```

2. **Push the Image to Docker Hub:** 📤
   ```
   docker push launchpadapps/aab-backend-v1
   ```

3. **Clear existing containers and images:** 🧹
   ```
     sudo docker ps
     sudo docker stop $(sudo docker ps -aq)
     sudo docker rm $(sudo docker ps -aq)
     sudo docker rmi -f $(sudo docker images -aq)   
   ```

4. **Pull and Run the Image on AWS EC2 Instance:** ☁️
   - Log into your AWS EC2 instance.
   - Pull the Docker image:
     ```
     sudo docker pull launchpadapps/aab-backend-v1
     ```
   - Run the image as a container:
     ```
     sudo docker run -d --restart=always --publish 3000:3000 launchpadapps/aab-backend-v1     
   ```

### Prerequisites for Manual Deployment

- Docker installed on your local machine and AWS EC2 instance 🐳.
- An account on Docker Hub 📥.
- AWS CLI set up and configured on your local machine ☁️.

## 🛠 Built With

- [Node.js](https://nodejs.org/) - The runtime environment 🌐
- [Express](https://expressjs.com/) - The web framework used 💡
- [Docker](https://www.docker.com/) - Containerization platform 🐳
- [GitHub Actions](https://github.com/features/actions) - CI/CD pipeline 🔄
- [AWS EC2](https://aws.amazon.com/ec2/)

 - Deployment platform ☁️

## 🔢 Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your-repository/automobile-platform/tags).