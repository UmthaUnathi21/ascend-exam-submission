'use strict';

/* EXPLORE.JS (Explore page)*/

document.addEventListener('DOMContentLoaded', () => {

    // Check if we are truly on the explore page
    if (!document.getElementById('explore-page')) {
        return;
    }

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const spinner = document.getElementById('loading-spinner');
    const noResultsMessage = document.getElementById('no-results-message');
    
// GSAP Page load timeline 
    gsap.timeline()
        .to(".explore-title", { opacity: 1, y: 0, duration: 0.5 })
        .to(".explore-tagline", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
        .to(".search-bar-container", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

// SVG/MotionPath (Loading spinner)
    const spinnerTimeline = gsap.timeline({ repeat: -1, paused: true });
    spinnerTimeline.fromTo("#spinner-path", 
        { strokeDashoffset: 283, ease: "power1.in" },
        { strokeDashoffset: 0, duration: 1.5, ease: "power1.out" }
    ).to("#spinner-path", 
        { strokeDashoffset: -283, duration: 1.5, ease: "power1.in" }, 
        "+=0.5"
    );

// Event Listeners.
    searchButton.addEventListener('click', () => {
        fetchJobs(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            fetchJobs(searchInput.value);
        }
    });

    
    async function fetchJobs(keyword) {
        if (!keyword) return;

        resultsContainer.innerHTML = '';
        noResultsMessage.style.display = 'none';
        spinner.style.display = 'block';
        spinnerTimeline.play();

        const url = `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(keyword)}&ResultsPerPage=12`;
        
        const headers = {
            "Host": "data.usajobs.gov",
            "User-Agent": "Ascend-Exam-Project/1.0 (umthaoupa@gmail.com)", // User-Agent
            "Authorization-Key": "MpRDljoknJEr/AcmACHs94wSUUPnfkrmxESszM8Vn5k=" // API Key
        };

        try {
            const response = await fetch(url, { method: 'GET', headers: headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            spinner.style.display = 'none';
            spinnerTimeline.pause();

            const jobs = data.SearchResult.SearchResultItems;
            if (jobs.length === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                renderJobs(jobs);
            }

        } catch (error) {
            spinner.style.display = 'none';
            spinnerTimeline.pause();
            console.error("Error fetching jobs:", error);
            noResultsMessage.innerHTML = '<h3>An error occurred.</h3><p>Could not fetch job data. Please try again later.</p>';
            noResultsMessage.style.display = 'block';
        }
    }

/* Render jobs function */
    function renderJobs(jobs) {
        resultsContainer.innerHTML = ''; 
        
        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'career-card';
            
            const jobData = job.MatchedObjectDescriptor;
            
            const salaryHTML = formatSalary(jobData.PositionRemuneration); // This is where the helper function is called.

            
            card.innerHTML = `
                <h3>${jobData.PositionTitle}</h3>
                <p class="organization">${jobData.OrganizationName}</p>
                <p class="location">${jobData.PositionLocationDisplay}</p>
                ${salaryHTML} <a href="${jobData.PositionURI}" target="_blank" class="btn-details">View Details</a>
            `;
            resultsContainer.appendChild(card);
        });

    // GSAP Stagger animation.
        gsap.to(".career-card", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1, 
            ease: "power2.out"
        });
    }
    
});