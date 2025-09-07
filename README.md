#hackodisha
# FillMeUp 🚀 (Auto-Fill Extension + Backend)

FillMeUp is a Chrome extension + Node.js backend that helps you **auto-fill forms** on any website using pre-stored profile data saved in MongoDB Atlas.  
it auto fill all the pre stored information all at once.

project-folder/
│── fillmeupbackend.js # Node.js backend server
│── frontend.html # Frontend form to save profile
│── .env # Environment variables (MongoDB URI, PORT)
│── package.json # Dependencies
│── autofill-extension/ # Chrome Extension
│ ├── manifest.json
│ ├── popup.html
│ ├── popup.js
│ ├── content.js


## ⚙Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account


## Setup Instructions

### 1. Clone the Repository
### 2. Dependencies
  npm install
### 3. Configure Environment Variables
  Create a file named .env in the root folder:
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/fillmeup?retryWrites=true&w=majority
  PORT=5000
  (copy this url from mongodb atlas site)
### 4. start the backend file
  node fillmeupbackend.js
  (in the same folder as ur file is saved)
### 5.  Frontend Form
  Open frontend.html in your browser.
  Fill out your details → Submit → Profile will be stored in MongoDB.
### 6. chrome Extension Setup
  Open Chrome → go to chrome://extensions/
  Enable Developer Mode (top-right).
  Click Load Unpacked → Select the autofill-extension folder.
  Extension is installed 
### 7. Usage
  Open any form on the web.
  Click the FillMeUp extension icon → then click Fill Profile.
  Your saved data will be auto-filled into the form fields.

Common Issues
a) npm not recognized → Install Node.js properly and restart terminal.
b) MongoDB connection error → Ensure your .env MONGO_URI is correct and IP is whitelisted in MongoDB Atlas.

IMPORTANT : USE DUMMY WEBSITE FOR PROPER IMPLIMENTATION


