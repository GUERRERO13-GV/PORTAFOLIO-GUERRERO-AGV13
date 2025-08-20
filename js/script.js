document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach((section, sectionIndex) => {
        const elements = section.querySelectorAll('> *');
        elements.forEach((element, elementIndex) => {
            element.style.opacity = '0';
            element.style.transitionDelay = `${elementIndex * 0.1}s`;
            observer.observe(element);
        });
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// Back to top button functionality
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('html, body').scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme Switcher
const themeSwitch = document.getElementById('checkbox');
const body = document.body;

function setMode(mode) {
    const professionalContent = document.querySelectorAll('.professional-content');
    const gamerContent = document.querySelectorAll('.gamer-content');

    if (mode === 'gamer') {
        body.classList.add('gamer-mode');
        body.classList.remove('professional-mode');
        professionalContent.forEach(el => el.style.display = 'none');
        gamerContent.forEach(el => el.style.display = 'block');
        themeSwitch.checked = true;
    } else { // Professional mode
        body.classList.remove('gamer-mode');
        body.classList.add('professional-mode');
        professionalContent.forEach(el => el.style.display = 'block');
        gamerContent.forEach(el => el.style.display = 'none');
        themeSwitch.checked = false;
        // Ensure GitHub repos are loaded if they haven't been
        if (!document.querySelector('.projects-grid').hasChildNodes()) {
            getGitHubRepos();
        }
    }
}

themeSwitch.addEventListener('change', () => {
    const mode = themeSwitch.checked ? 'gamer' : 'professional';
    localStorage.setItem('portfolioMode', mode);
    setMode(mode);
});

// Check for saved mode in localStorage
const savedMode = localStorage.getItem('portfolioMode') || 'professional';
setMode(savedMode);

// Fetch GitHub Repos
async function getGitHubRepos() {
    const projectsGrid = document.querySelector('.projects-grid');
    const username = 'GUERRERO13-GV';
    const url = `https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repos = await response.json();

        projectsGrid.innerHTML = ''; // Clear loader or placeholder

        if (repos.length === 0) {
            projectsGrid.innerHTML = '<p>No se encontraron proyectos en GitHub.</p>';
            return;
        }

        repos.forEach(repo => {
            const projectCard = document.createElement('a');
            projectCard.href = repo.html_url;
            projectCard.target = '_blank';
            projectCard.classList.add('project-card');

            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Sin descripción.'}</p>
                <div class="repo-stats">
                    <span>${repo.language || 'N/A'}</span>
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });

    } catch (error) {
        projectsGrid.innerHTML = `<p>No se pudieron cargar los proyectos de GitHub en este momento. Puedes verlos directamente en <a href="https://github.com/${username}" target="_blank">el perfil de GitHub</a>.</p>`;
        console.error('Error fetching GitHub repos:', error);
    }
}

getGitHubRepos();
