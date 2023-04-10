import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
const { Octokit } = require("@octokit/core");

async function createForkAndPR(octokit: InstanceType<typeof Octokit>, directoryName: string, fileName: string) {

    const upstreamOwner = "bitcointranscripts";
    const upstreamRepo = "bitcointranscripts";
    
    // Fork the repository
    const forkResult = await octokit.request("POST /repos/{owner}/{repo}/forks", {
      owner: upstreamOwner,
      repo: upstreamRepo,
    });
  
    const forkOwner = forkResult.data.owner.login;
    const forkRepo = "bitcointranscripts";
    
    // Create a branch
    const timeInSeconds = Math.floor(Date.now() / 1000);
    const newBranchName = `${timeInSeconds}-${directoryName}`;
    const baseBranch = forkResult.data.default_branch;
  
    // Get the reference for the base branch
    const baseRefResult = await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
      owner: forkOwner,
      repo: forkRepo,
      ref: `heads/${baseBranch}`,
    });
  
    const baseRefSha = baseRefResult.data.object.sha;
  
    // Create a new branch
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: forkOwner,
      repo: forkRepo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    });
  
    // Create a pull request
    const prTitle = `Add ${fileName} to ${directoryName}`;
    const prDescription = `This PR adds ${fileName} to the ${directoryName} directory.`;
    const prResult = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
      owner: forkOwner, // update to upstreamOwner once tested
      repo: upstreamRepo,
      title: prTitle,
      body: prDescription,
      head: `${forkOwner}:${newBranchName}`,
      base: baseBranch,
    });
  
    return prResult;
  }
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // Check if the user is authenticated
    const session = await getSession({ req });
    if (!session || !session.accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    // Initialize Octokit with the user's access token
    const octokit = new Octokit({ auth: session.accessToken });
  
    // Read directoryName and fileName from the request
    const { directoryName, fileName } = req.body;
  
    try {
      // Call the createForkAndPR function
      const prResult = await createForkAndPR(octokit, directoryName, fileName);
  
      // Return the result
      res.status(200).json(prResult.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error occurred while creating the fork and PR" });
    }
  }
