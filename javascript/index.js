
import { renderAllProjects } from './projectGrid.js';


document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.project-category');
  const navLinks = document.querySelectorAll('.header-nav a');

  function updateActiveLink() {
    let index = -1; // default: no section matched yet

    for (let i = 0; i < sections.length; i++) {
      const sectionTop = sections[i].offsetTop - 250;
      if (window.scrollY >= sectionTop) {
        index = i;
      } else {
        break;
      }
    }

    navLinks.forEach(link => link.classList.remove('active'));

    if (index === -1) {
      // No section matched, highlight Home (assumed to be first link)
      navLinks[0].classList.add('active');
    } else {
      // Highlight the matched section link (offset by 1 if Home is first)
      navLinks[index + 1].classList.add('active');
    }
  }

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);
});

renderAllProjects();