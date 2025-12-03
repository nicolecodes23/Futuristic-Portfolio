const tabsContainer = document.querySelector('.tabs-container');
const cursor = document.querySelector('.cursor');
const tabs = document.querySelectorAll('.tab');

tabsContainer.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
});

tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => {
        const { width } = tab.getBoundingClientRect();
        cursor.style.width = `${width}px`;
        cursor.style.height = '47px';
        cursor.style.left = `${tab.offsetLeft}px`;
        cursor.style.opacity = 1;
    });
});
