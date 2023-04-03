## LOGIC

- Once a review is done and submitted, it's time to open a PR
    - Get the content field of the transcript's JSON payload
    - Write it to an md file inside a `tmp` folder -> refer to `writeToFile` function in `samplepr.js`
    - Setup necessary github details -> refer to `initializeRepo.sh` and `github.sh` bash scripts in api folder
    - Create a pr by adding the md file to the `bitcointranscripts/testfolder` in the current working directory
    - remove committed md file from `tmp` folder
- Currently the pull requests are opened against a fork of the bitcointranscripts repo (am not sure this is the intended workflow but i found it effective for test purposes
since in that case we are not spamming the upstream

## NOTES 
- This is the first draft of the PR that could be improved with some suggestions

## REQUIREMENTS

-  To enable us fork bitcointranscript repo and open a PR, we require you to login into your GitHub account. Kindly install `GITHUB CLI` using the instructions on their repo [here](https://github.com/cli/cli#installation). Following the prompt, please select the below options from the prompt to login:

    -  what account do you want to log into? `Github.com`

    -  what is your preferred protocol for Git operations? `SSH`

    -  Upload your SSH public key to your GitHub account? `skip`

    -  How would you like to authenticate GitHub CLI? `Login with a web browser`

    - copy the generated one-time pass-code and paste in the browser to authenticate if you have enabled 2FA

-   Inside the api folder:
    - Replace the `username` in `samplepr.js` with your authenticated github username
    - Run `node samplepr.js`
