const { spawn } = require('child_process');

// 파이썬 파일 실행 함수 정의
function runPythonScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath, ...args]);

    let result = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python:', data.toString());
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process exited with code', code);
        reject(code);
      } else {
        resolve(result);
      }
    });
  });
}

module.exprots = runPythonScript();