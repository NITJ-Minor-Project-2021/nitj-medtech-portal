# nitj-medtech-portal

Here’s a formatted README file based on your provided details:

---

# Medical Management System

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The **Medical Management System** is a web application aimed at improving the management of medical data for colleges or hospitals. This application enables efficient handling of user authentication, doctor appointments, medical camps, prescriptions, hospitals, and more. It leverages Node.js, Express, MongoDB, Passport.js for authentication, and modern web technologies to offer a robust solution for healthcare data management.

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
   git clone https://github.com/Lavishgurjar85/College-Dispensary.git
   ```

2. Navigate to the project directory:

   ```bash
   cd medical-management-system
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

1. Start the MongoDB server:

   ```bash
   mongod
   ```

2. Start the Node.js server:

   ```bash
   node app.js
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to use the application.

## API Endpoints

Here is a summary of the key endpoints available in the application:

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| GET    | `/api/patients`      | Retrieve patient list             |
| POST   | `/api/patients`      | Register a new patient            |
| GET    | `/api/doctors`       | Retrieve doctor list              |
| POST   | `/api/appointments`  | Book an appointment               |
| GET    | `/api/hospitals`     | Retrieve nearby hospitals         |
| POST   | `/api/prescriptions` | Save a new prescription           |
| POST   | `/api/feedback`      | Submit user feedback              |
| POST   | `/api/files`         | Upload medical files or reports   |
| POST   | `/api/predict`       | Predict disease based on symptoms |

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README file provides a clear, organized overview of your Medical Management System project. Let me know if you need further customization!
