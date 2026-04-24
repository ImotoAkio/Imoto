async function test() {
  console.log('Fetching...');
  const res = await fetch('https://docs.google.com/spreadsheets/d/18bl6QaVDHRrtjtI8mWVP2PI4oOOU7Qj9TO2jyqOUl1M/export?format=csv');
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
}
test();
