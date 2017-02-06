const { shell } = require('electron');

const newLinkUrl = document.querySelector('.new-link-form--url');
const newLinkSubmit = document.querySelector('.new-link-form--submit');
const newLinkForm = document.querySelector('.new-link-form');
const errorMessage = document.querySelector('.message');
const linkTemplate = document.querySelector('#link-template');
const linksSection = document.querySelector('.links');
const clearStorageButton = document.querySelector('.controls--clear-storage');

const parser = new DOMParser();
const parseResponse = (text) => parser.parseFromString(text, 'text/html');
const findTitle = (nodes) => nodes.querySelector('title').innerText;

window.addEventListener('load', () => {
  for (let title of Object.keys(localStorage)) {
    addToPage({ title, url: localStorage.getItem(title) });
  }
});

clearStorageButton.addEventListener('click', () => {
  localStorage.clear();
  linksSection.innerHTML = '';
});

const addToPage = ({ title, url }) => {
  const newLink = linkTemplate.content.cloneNode(true);
  const titleElement = newLink.querySelector('.link--title');
  const urlElement =  newLink.querySelector('.link--url')

  titleElement.textContent = title;
  urlElement.href = url;
  urlElement.textContent = url;

  linksSection.appendChild(newLink);
  return { title, url };
};

newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = newLinkUrl.value;

  fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => ({ title, url }))
    .then(addToPage)
    .then(storeLink)
    .then(clearInput)
    .catch(error => {
      console.error(error);
      errorMessage.textContent = `There was an error fetching "${url}."`
    });
});

linksSection.addEventListener('click', (event) => {
  if (event.target.href) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

const storeLink = ({ title, url }) => {
  localStorage.setItem(title, url);
  return { title, url };
};

const clearInput = () => {
  newLinkUrl.value = '';
};
