const { spawn } = require('child_process');

const getSentimentPrediction = (inputText) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['backend/sentimentAnalysis/predict_sentiment.py', inputText]);

    let result = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result.trim()); // Directly resolve the sentiment class
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
};

module.exports = getSentimentPrediction
