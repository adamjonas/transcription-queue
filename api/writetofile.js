const fs = require('fs');
//const generatePayload = require('./generatePayload');
const datum = require('./testdatajson');

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

    const fileName = title.replace(/ /g, '-');
    const fileNameWithExt = `tmp/${fileName}.md`;

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

console.log(datum.media);

const locus = writeToFile(result, url, title, date, tags, category, speakers,username,pr) 

console.log(locus)
