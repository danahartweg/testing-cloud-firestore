# Testing Cloud Firestore
Writing Cloud Firestore functions and security rules is relatively well documented and understood. Testing them, however, is not.

This repository was initially created as a companion to [this article](https://medium.com/@danahartweg/testing-guide-for-cloud-firestore-functions-and-security-rules-39d9f3c92d99) and has since [been updated](https://medium.com/geekculture/updated-cloud-firestore-testing-guide-ce146f2b312) with the latest Cloud Firestore has to offer.

## Quick setup
```bash
yarn global add firebase-tools@9.16.0

cd server
yarn install
yarn lint && yarn validate
```

## Running the tests
The `project-id` used to cause a bunch of headaches for testing, but no longer! Check out [this section](https://medium.com/geekculture/updated-cloud-firestore-testing-guide-ce146f2b312#c512) of the guide for more details.

```bash
yarn test
```
