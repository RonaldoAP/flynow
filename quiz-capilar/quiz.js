const incoming = new URLSearchParams(window.location.search);
if (!incoming.get('clickid') && incoming.get('rtkcid')) {
  incoming.set('clickid', incoming.get('rtkcid'));
}
for (const link of document.querySelectorAll('[data-quiz]')) {
  const destination = new URL(link.href);
  incoming.forEach((value, key) => destination.searchParams.append(key, value));
  link.href = destination.href;
}
