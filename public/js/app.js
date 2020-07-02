const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', function (e) {
    const tabContent = document.querySelectorAll('.tab-content');
    tabContent.forEach(tab => (tab.style.display = 'none'));
    tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));

    const currentTab = document.querySelector(btn.dataset.tab);
    currentTab.style.display = 'block';
    btn.classList.add('active');
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#default').click();
});

const deleteBtns = document.querySelectorAll('#delete-btn');

for (const btn of deleteBtns) {
  btn.addEventListener('click', function (e) {
    const deletePost = async () => {
      await fetch(`/blog/${this.dataset.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    const privateBlogCount = document.querySelector('.blog-count-private');
    const publicBlogCount = document.querySelector('.blog-count-public');
    deletePost();
    document.querySelector(`#id${this.dataset.id}`).remove();
    const privateBlogs = document.querySelectorAll('.private-post').length;
    const publicBlogs = document.querySelectorAll('.public-post').length;

    privateBlogCount.textContent = privateBlogs;
    publicBlogCount.textContent = publicBlogs;

    if (privateBlogs == 0 && publicBlogs == 0) {
      privateBlogCount.textContent = '';
      publicBlogCount.textContent = '';
      return '';
    }
    if (privateBlogs === 0) {
      return (privateBlogCount.textContent = '');
    }
    if (publicBlogs === 0) {
      return (publicBlogCount.textContent = '');
    }
  });
}
