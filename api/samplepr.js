const { spawnSync } = require('child_process');
const datum = require('./testdatajson');
const fs = require('fs');
const path = require('path');


const result = datum.body;
const url = datum.media;
const title = datum.title;
const date = datum.date;
const tags = datum.tags;
const category = datum.categories;
const speakers = datum.speakers;
const username = "nassersaazi";
const pr = true;


function writeToFile(result, url, title, date, tags, category, speakers, videoTitle, username, local, test, pr) {
  try {
    let transcribedText = result;
    let fileTitle;
    if (title) {
      fileTitle = title;
    } else {
      fileTitle = videoTitle;
    }

    let metaData = `---\n` +
                   `title: ${fileTitle}\n` +
                   `transcript_by: ${username} via TBTBTC v3\n`;

    if (!local) {
      metaData += `media: ${url}\n`;
    }

    if (tags) {
      tags = tags.trim();
      tags = tags.split(",");
      for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
      }
      metaData += `tags: ${tags}\n`;
    }

    if (speakers) {
      speakers = speakers.trim();
      speakers = speakers.split(",");
      for (let i = 0; i < speakers.length; i++) {
        speakers[i] = speakers[i].trim();
      }
      metaData += `speakers: ${speakers}\n`;
    }

    if (category) {
      category = category.trim();
      category = category.split(",");
      for (let i = 0; i < category.length; i++) {
        category[i] = category[i].trim();
      }
      metaData += `categories: ${category}\n`;
    }

    const dir = './tmp';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log("Folder tmp created successfully");
      }
    const fileName = title.replace(/ /g, '-');
    const fileNameWithExt = `${path.resolve('.')}/tmp/${fileName}.md`;

    if (date) {
      metaData = metaData + `date: ${date}\n\n`;
    }

    metaData += `---\n`;

    console.log("writing .md file");
    fs.appendFileSync(fileNameWithExt, `${metaData}\n${transcribedText}\n`);

    if (local) {
      url = null;
    }


    return fileNameWithExt;

  } catch (error) {
    console.error("Error writing to file");
    console.error(error);
  }
}

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

const absolutePath = writeToFile(result, url, title, date, tags, category, speakers,username,pr);
console.log(absolutePath);

const loc = 'btctranscripts/testfolder';
const currTime = Math.round(Date.now());

createPR(absolutePath, loc, username, currTime, title);

