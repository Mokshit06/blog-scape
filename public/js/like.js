for (const btn of document.querySelectorAll('.btn-like i')) {
  btn.addEventListener('click', async function () {
    this.classList.remove('fa-thumbs-o-up');
    this.classList.add('fa-thumbs-up');
    document.querySelector(`#id${this.dataset.id}`).textContent =
      parseInt(document.querySelector(`#id${this.dataset.id}`).textContent) + 1;
    const like = await fetch(`/blog/like/${this.dataset.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!like.ok) {
      return console.error(
        `Something went wrong ${like.status} ${like.statusText}`
      );
    }
  });
}
