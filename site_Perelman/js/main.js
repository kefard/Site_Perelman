// Мобильное меню и автоматический подсчет статистики контента на странице
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            const isExpanded = nav.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Если на странице есть блок проверки ТЗ (#tz-counter), считаем слова, знаки и картинки
    const counterBox = document.getElementById('tz-counter');
    if (counterBox) {
        const mainText = document.querySelector('.wrapper').innerText.trim();
        const charCount = mainText.length;
        const wordCount = mainText.split(/\s+/).filter(Boolean).length;
        const imgCount = document.querySelectorAll('.wrapper img').length;

        counterBox.innerHTML = `
            <strong>Статистика текущей страницы:</strong>
            Символов: <b>${charCount}</b> | Слов: <b>${wordCount}</b> | Изображений (<code>&lt;img&gt;</code>): <b>${imgCount}</b>
        `;
    }
});
