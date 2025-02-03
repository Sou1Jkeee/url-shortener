const URL_PATTERN = `^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$`;

function debounce(fn, t = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, t, ...args);
  };
}

function showPopup() {
  const popupEl = document.getElementById('popupText');
  popupEl.classList.add('show');
}

function hidePopup() {
  const popupEl = document.getElementById('popupText');
  popupEl.classList.remove('show');
}

const debouncedHidePopup = debounce(hidePopup, 5000);

async function copyToClipboard(shortLink) {
  if (!shortLink) return Promise.reject();

  return await navigator.clipboard.writeText(shortLink);
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
    .then(async (result) => {
      const { shortUrl } = result;
      shortLinkEl.value = shortUrl || null;

      await copyToClipboard(shortUrl).then(() => {
        showPopup();
        debouncedHidePopup();
      });
    });

  buttonEl.disabled = true;
  linkInputEl.classList.remove('is-valid');
  linkInputEl.value = null;
  inputText = null;
}

document.addEventListener('DOMContentLoaded', () => {
  const linkInputEl = document.getElementById('inputLink');
  const buttonEl = document.getElementById('submitButton');
  const shortLinkEl = document.getElementById('shortLink');

  linkInputEl.addEventListener(
    'input',
    debounce((e) => {
      const regex = new RegExp(URL_PATTERN, 'i');
      const isValid = regex.test(e.target.value);

      if (isValid) {
        linkInputEl.classList.add('is-valid');
        linkInputEl.classList.remove('is-invalid');
      } else {
        linkInputEl.classList.add('is-invalid');
        linkInputEl.classList.remove('is-valid');
      }

      buttonEl.disabled = !isValid;

      inputText = e.target.value;
      shortLinkEl.value = null;
      hidePopup();
    })
  );

  window.addEventListener('unload', () => {
    if (shortLinkEl && shortLinkEl?.value) shortLinkEl.value = null;
  });
});
