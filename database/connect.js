const { exec } = require('child_process');

function runQuery(query, callback) {
  const command = `psql -U townwall -d townwall -c "${query}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return callback(error);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return callback(stderr);
    }
    callback(null, stdout);
  });
}

module.exports = runQuery;
