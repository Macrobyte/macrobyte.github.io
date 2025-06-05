
import { renderAllProjects } from './projectGrid.js';

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.project-category');
  const navLinks = document.querySelectorAll('.header-right a');

  function updateActiveLink() {
  let index = 0; // default to first section

  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].offsetTop - 250;
    if (window.scrollY >= sectionTop) {
      index = i; // move index forward if scroll passed section start
    } else {
      break; // no need to check further
    }
  }

  navLinks.forEach(link => link.classList.remove('active'));
  navLinks[index].classList.add('active');
}

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);
});

renderAllProjects();