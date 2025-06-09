
import { renderAllProjects } from './projectGrid.js';


document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.project-category');
  const navLinks = document.querySelectorAll('.header-nav a');

  function updateActiveLink() {
    let index = -1;

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

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent click from bubbling up
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', expanded);
  });

  // Close the menu if clicking outside of it
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
    }
  });

  const menuLinks = mobileMenu.querySelectorAll('a');

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
    });
  });

});

renderAllProjects();