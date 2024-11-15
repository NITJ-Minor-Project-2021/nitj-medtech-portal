# NITJ MedTech Portal

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)

## Introduction

The Project is based on **Medical Management System** which is a web application aimed at improving the management of medical data for colleges or hospitals. This application enables efficient handling of user authentication, doctor appointments, medical camps, prescriptions, hospitals, and more. It leverages Node.js, Express, MongoDB, Passport.js for authentication, and modern web technologies to offer a robust solution for healthcare data management.

## Features

- **User Authentication and Authorization**: Supports Patients, Doctors, and Admin roles
- **Dashboard**: Displays medical guidelines, upcoming camps, and nearby hospitals
- **Prescription Management**: Encrypts and stores prescription data securely
- **Appointment Booking System**: Allows patients to book appointments with doctors
- **Feedback Submission**: Collects feedback from users to improve service
- **File Upload**: Uploads reports and medical guidelines
- **Disease Prediction**: Utilizes a Python script for disease prediction based on symptoms

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool for Node.js
- **Passport.js**: Middleware for user authentication
- **EJS**: Embedded JavaScript templates for server-side rendering
- **Multer**: Middleware for handling file uploads
- **Python**: Script for disease prediction functionality

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js**
- **MongoDB**
- **Python** (if using the disease prediction feature)

## Installation

1. Clone the repository:

   ```bash
   git clone hhttps://github.com/NITJ-Minor-Project-2021/nitj-medtech-portal.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nitj-medtech-portal
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```plaintext
SECRET=yourSecretKey
```

Replace `yourSecretKey` with a secure key of your choice.

## Usage

1. Start the Node.js server:

   ```bash
   node app.js
   ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to use the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
