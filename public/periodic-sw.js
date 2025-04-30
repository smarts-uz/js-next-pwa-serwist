self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

const syncContent = async () => {
  const res = await fetch('/api/test-response?status=200');
  const data = await res.json();
  console.log(data);
};


