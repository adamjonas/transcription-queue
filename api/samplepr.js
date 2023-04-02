const { spawnSync } = require('child_process');
const fs = require('fs');

function createPR(absolutePath, loc, username, currTime, title) {
  const branchName = loc.replace('/', '-');
  const initializeResult = spawnSync('bash', ['initializeRepo.sh', absolutePath, loc, branchName, username, currTime]);
  if (initializeResult.status !== 0) {
    console.error(`Error occurred while running initializeRepo.sh. Output: ${initializeResult.stderr.toString()}`);
    return;
  }

  const githubResult = spawnSync('bash', ['github.sh', branchName, username, currTime, title]);
  if (githubResult.status !== 0) {
    console.error(`Error occurred while creating pull request. Output: ${githubResult.stderr.toString()}`);
    return;
  }

  console.log('Pull request created successfully.');
}

const absolutePath = '/home/saazi/Downloads/lndconfigs/tmp';
const loc = 'halo/welt';
const username = 'nassersaazi';
const currTime = Math.round(Date.now());
const title = 'hello';

createPR(absolutePath, loc, username, currTime, title);

