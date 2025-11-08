'use strict';
/* MAIN.JS (SHARED CODE)*/

/* Registers GSAP plugins for all other scripts.*/
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);


/* Shared NAV - This runs on every page to build the nav bar.*/
document.addEventListener('DOMContentLoaded', () => {

    const navLinks = [
        { text: 'Home', href: 'index.html' },
        { text: 'Dashboard', href: 'dashboard.html' },
        { text: 'Explore', href: 'explore.html' }
    ];
    
    const navContainer = document.querySelector('nav ul');

    // Checks if nav container exists before trying to use it.
    if (navContainer) {
        // Find the current page
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = link.text;
            a.href = link.href;
            if (link.href === currentPath) {
                a.classList.add('active');
            }
            li.appendChild(a);
            navContainer.appendChild(li);
        });
    }

}); 

/* Function to format the salary data */
    function formatSalary(remunerationArray) {
        
        // --- THIS IS THE FIX ---
        // We check if the array exists and has at least one item
        if (!remunerationArray || remunerationArray.length === 0) {
            return '<p class="salary">Salary not specified</p>';
        }

        // We get the FIRST salary object from the array
        const salaryData = remunerationArray[0];
        // --- END OF FIX ---

        // Now we check the object from the array
        if (!salaryData.MinimumRange) {
            return '<p class="salary">Salary not specified</p>';
        }

        // And use the object's data
        const min = parseFloat(salaryData.MinimumRange).toLocaleString('en-US');
        const max = parseFloat(salaryData.MaximumRange).toLocaleString('en-US');
        const rate = salaryData.Description;

        let salaryString = '';
        if (min === max) {
            salaryString = `$${min}`;
        } else {
            salaryString = `$${min} - $${max}`;
        }

        return `<p class="salary">${salaryString} ${rate}</p>`;
    }