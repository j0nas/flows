const outputLineToConsole = line => {
  console.log(
    line
      .split('|')
      .slice(1)
      .map((item, index) => item.padEnd(columnHeaders[index] && columnHeaders[index].length + 1 || 0))
      .join('| ')
  );
};