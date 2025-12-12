document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const initTabs = (navSelector, contentSelector) => {
        const navItems = document.querySelectorAll(navSelector);
        const contentItems = document.querySelectorAll(contentSelector);

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');

                // Update Nav State
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update Content State
                contentItems.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    };

    // Initialize based on available elements
    if (document.querySelector('.bottom-nav')) {
        initTabs('.nav-item', '.dash-tab-content'); // User Dashboard
    }

    if (document.querySelector('.sidebar')) {
        initTabs('.sidebar-nav-item', '.dash-tab-content'); // Therapist Dashboard
    }
});
