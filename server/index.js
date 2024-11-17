import express from 'express';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '..', 'dist')));

app.post('/api/search', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const scriptPath = join(__dirname, '..', 'scripts', 'search_profiles.py');
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      args: [username.toLowerCase().replace(/\s+/g, '')]
    };

    PythonShell.run(scriptPath, options).then(results => {
      res.json(results[0] || []);
    }).catch(error => {
      console.error('Python script error:', error);
      res.status(500).json({ error: 'Failed to search profiles' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle React Router routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});