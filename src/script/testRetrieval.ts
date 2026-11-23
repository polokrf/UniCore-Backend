import { vectorStore } from '../lib/vectoreStore';

const main = async () => {
  const results = await vectorStore.similaritySearch(
    'CSE101 Introduction to Programming',
    5,
  );

  console.log('Retrieved Documents:', results.length);

  results.forEach((doc, index) => {
    console.log(`\nDocument ${index + 1}`);
    console.log('Content:', doc.pageContent);
    console.log('Metadata:', doc.metadata);
  });
};

main();
