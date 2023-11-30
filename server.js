import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const jiraUrl = process.env.JIRA_URL;
const email = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/task', async (req, res, next) => {
  try {
    const fetchJira = async (jql) => {
      const response = await fetch(`${jiraUrl}/search?jql=${jql}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${jiraApiToken}`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Jira API request failed with status: ${response.status}`);
      }

      return await response.json();
    };

    const assignedData = await fetchJira('assignee=currentuser()');
    const assignedIssues = assignedData.issues.map(issue => ({
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
    }));

    const unassignedData = await fetchJira('assignee=null');
    const unassignedIssues = unassignedData.issues.map(issue => ({
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
    }));

    res.json({ projectName: 'My Kanban Project (Assignee)', assignedIssues, unassignedIssues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});