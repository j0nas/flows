const fs = require('fs');
const path = require('path');
const util = require('util');
const flatten = require('array-flatten');
const readMultipleFiles = require('read-multiple-files');

const readdir = util.promisify(fs.readdir);
const flowsDirectory = path.join(__dirname, 'flows');

const getFlowDirectories = async flowDirectoryName => {
  const flowDirectories = await readdir(flowsDirectory, 'utf8');
  const flowFiles = await Promise.all(
    flowDirectories
      .map(dir => path.join(flowsDirectory, dir, flowDirectoryName))
      .map(dirPath => readdir(dirPath, 'utf8').then(res => res.map(file => path.join(dirPath, file))))
  );

  return flatten(flowFiles);
};

const formatFlow = (flowName, contents) => {
  const rawColumns = contents.split('\n')[2].split('|');

  // delete 'group id' first column and always-empty last column
  const columns = rawColumns.slice(1, rawColumns.length - 1);

  if (flowName === 'D0055') {
    // format REGI date to Postgres Date
    columns[3] = [`${columns[3].substring(0, 4)}-${columns[3].substring(4, 6)}-${columns[3].substring(6)}`];
  }

  return columns.join(',') + '\n';
};

const getFlowsAsCSV = async (flowName, stream) => {
  const files = await getFlowDirectories(flowName);
  readMultipleFiles(files, 'utf8').subscribe({
    next({ contents }) {
      stream.write(formatFlow(flowName, contents));
    }
  })
};

const getAllFlowNames = async () => {
  const datedDirectories = await readdir(flowsDirectory, 'utf8');
  const flowDirectories = await Promise.all(datedDirectories.map(flowDirectory => readdir(path.join(flowsDirectory, flowDirectory), 'utf8')));
  return Array.from(new Set(flatten(flowDirectories))).filter(directory => directory.startsWith('D0'));
};

const createFlowWriteStreams = async () => {
  const allFlowNames = await getAllFlowNames();
  allFlowNames
    .map(flow => ({ flow, stream: fs.createWriteStream(`./${flow}.csv`) }))
    .forEach(({ flow, stream }) => getFlowsAsCSV(flow, stream));
};

createFlowWriteStreams();