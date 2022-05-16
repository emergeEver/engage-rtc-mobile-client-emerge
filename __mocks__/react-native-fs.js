export default {
  readDir: () => {
    return Promise.resolve([{path: {isFile: jest.fn()}}]);
  },
  DocumentDirectoryPath: 'testPath',
  stat: jest.fn(test).mockReturnValue(test),
};
