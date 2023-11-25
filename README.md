# Implementation Documentation

## Overview
This project is an Algorand account watcher REST API that allows clients to add accounts to track changes using the Algorand node API and MongoDB to store account data.


## Before using

- Please make sure that you have:
 - Node.js installed (https://nodejs.org/)
 - MongoDB installed and running locally (https://www.mongodb.com/)

## Usage

To run the project, please use a command line the following:
- Create a new database:
   - `use algorand-account-watcher`


- run the server at port 3600
    - `npm run start` 

To test the project, please use a command line the following:
- `npm run test`

## Requirements

The application meets the outlined requirements:

**1. Accept Algorand Addresses for Tracking**

- REST API endpoint to add an address to tracking list
- Saves addresses to MongoDB watcher collection

**2. Periodic State Checking**

- Runs a periodic job every 60 seconds
- Fetches latest balance for all tracked accounts
- Compares to previously stored balances

**3. Log Notifications on Change**

- If balance differs since last check, logs a notification
- Notification includes current timestamp, account details and state change

**4. List Tracked Accounts**

- REST endpoint returns current list of tracked accounts
- Includes address and current balance state

## Implementation Details

- Written in Node.js using Express framework
- Fetch account information using the Algorand Node API
- MongoDB used to persist account tracker data
- Mongoose used to define schema for tracked accounts
- Unit tests cover core functionality
- Configurable environment variables
- Uses node-schedule for periodic job

## Potential Enhancements

- [ ] Better Comparison Logic
  - Rather than just comparing account balances, implement more advanced diffing logic to compare entire account states


- [ ] Integrate Directly with Algorand SDK
  - Leverage algosdk directly instead of relying on API layer
  - Could enable things like support for different networks


- [ ] Store More Account Information
  - Currently only account balance is stored
  - Should store additional account details beyond just balance