function debounce(fn, t = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, t, ...args);
  };
}

let inputText = null;

function clickHandler(url) {
  const shortLinkEl = document.getElementById('shortLink');
  const linkInputEl = document.getElementById('inputLink');
  const buttonEl = document.getElementById('submitButton');

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origUrl: inputText }),
  })
    .then((response) => response.json())
    .then((result) => {
      linkEl = document.createElement('a');
      linkEl.innerText = result?.shortUrl || null;
      linkEl.href = result?.shortUrl || null;
      linkEl.id = 'shortUrl';

      shortLinkEl.replaceChildren(linkEl);
    });

  window.addEventListener('unload', () => {
    linkEl?.remove();
  });

  buttonEl.disabled = true;
  linkInputEl.classList.remove('valid-input');
  linkInputEl.value = null;
  inputText = null;
}

const URL_PATTERN = `^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$`;

document.addEventListener('DOMContentLoaded', () => {
  const linkInputEl = document.getElementById('inputLink');
  const buttonEl = document.getElementById('submitButton');

  linkInputEl.addEventListener(
    'input',
    debounce((e) => {
      const regex = new RegExp(URL_PATTERN, 'i');
      const isValid = regex.test(e.target.value);

      if (isValid) {
        linkInputEl.classList.add('valid-input');
        linkInputEl.classList.remove('invalid-input');
      } else {
        linkInputEl.classList.add('invalid-input');
        linkInputEl.classList.remove('valid-input');
      }

      buttonEl.disabled = !isValid;

      inputText = e.target.value;
    })
  );
});
