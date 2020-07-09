function resizeMasonryItem(item) {
  const grid = document.querySelector('.posts'),
    rowGap = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
    ),
    rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
    );

  const rowSpan =
    Math.ceil(
      (item.querySelector('.post-content').getBoundingClientRect().height +
        rowGap) /
        (rowHeight + rowGap)
    ) + 2;

  item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllMasonryItems() {
  const allItems = document.getElementsByClassName('post');

  for (const item of allItems) {
    resizeMasonryItem(item);
  }
}

const masonryEvents = ['load', 'resize'];
masonryEvents.forEach(event =>
  window.addEventListener(event, resizeAllMasonryItems)
);
