document
  .querySelector('.custom-select-wrapper')
  .addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
  });

for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', function () {
    if (!this.classList.contains('selected')) {
      this.parentNode
        .querySelector('.custom-option.selected')
        .classList.remove('selected');
      this.classList.add('selected');
      this.closest('.custom-select').querySelector(
        '.custom-select__trigger span'
      ).textContent = this.textContent;
    }
  });
}

window.addEventListener('click', function (e) {
  const select = document.querySelector('.custom-select');
  if (!select.contains(e.target)) {
    select.classList.remove('open');
  }
});

let editor;

ClassicEditor.create(document.querySelector('#editor'), {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
  ],
})
  .then(newEditor => (editor = newEditor))
  .catch(error => {
    console.error(error);
  });

const form = document.querySelector('.form');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  await fetch('/blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: document.querySelector('#title').value,
      body: editor.getData(),
      status: document.querySelector('.selected').value,
    }),
  });
  location.replace('/dashboard');
});
