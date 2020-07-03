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
