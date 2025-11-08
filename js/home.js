'use strict';

/* home.JS (Home Page Logic) */

document.addEventListener('DOMContentLoaded', () => {

// Hero Page Load Timeline
    gsap.timeline()
        .to(".hero-title span", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1 
        })
        .to(".hero-tagline", {
            opacity: 1,
            duration: 0.5
        }, "-=0.2")
        .to(".hero .cta-button", {
            opacity: 1,
            duration: 0.5
        }, "-=0.2");

// ScrollTrigger 
    gsap.utils.toArray(".step").forEach((step, i) => {
        gsap.fromTo(step, 
            { opacity: 0, y: 50 }, 
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scrollTrigger: {
                    trigger: step,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                delay: i * 0.1 
            }
        );
    });

// Testimonials ScrollTrigger 
    gsap.from(".testimonial-card", {
        scrollTrigger: {
            trigger: ".testimonials",
            start: "top 70%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.2
    });
    
    gsap.from(".final-cta", {
        scrollTrigger: {
            trigger: ".final-cta",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        duration: 1
    });


    /* Live API Job Previews */


fetchPreviewJobs();

async function fetchPreviewJobs() {
    const container = document.getElementById('preview-grid-container');
    if (!container) return; // Exit if container not found

    container.innerHTML = '<p>Loading live jobs...</p>'; // Loading state

    // API URL - it uses "Data Analyst" and will generate 3 results
    const keyword = "Data Analyst";
    const url = `https://data.usajobs.gov/api/search?Keyword=${keyword}&ResultsPerPage=3`;
    
    const headers = {
        "Host": "data.usajobs.gov",
        "User-Agent": "Ascend-Exam-Project/1.0 (umthaoupa@gmail.com)", // Your info
        "Authorization-Key": "MpRDljoknJEr/AcmACHs94wSUUPnfkrmxESszM8Vn5k=" // The API Key
    };

    try {
        const response = await fetch(url, { method: 'GET', headers: headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const jobs = data.SearchResult.SearchResultItems;

        // Clear loading message
        container.innerHTML = '';

        if (jobs.length > 0) {
            renderPreviewCards(jobs);
        } else {
            container.innerHTML = '<p>Could not load job previews.</p>';
        }

    } catch (error) {
        console.error("Error fetching preview jobs:", error);
        container.innerHTML = '<p>Could not load job previews.</p>';
    }
}

function renderPreviewCards(jobs) {
    const container = document.getElementById('preview-grid-container');
    
    jobs.forEach(job => {
        const jobData = job.MatchedObjectDescriptor;
        const card = document.createElement('div');
        card.className = 'career-card-preview'; // Maintain same styling.

        // Calls the function.
        const salaryHTML = formatSalary(jobData.PositionRemuneration);

        card.innerHTML = `
            <div>
                <h4>${jobData.PositionTitle}</h4>
                <p class="organization-preview">${jobData.OrganizationName}</p>
            </div>
            <div class="salary-preview">
                ${salaryHTML}
            </div>
        `;
        container.appendChild(card);
    });

    // Animates the cards with a looping "flash" effect.
    const cards = gsap.utils.toArray(".career-card-preview");

    const flashTimeline = gsap.timeline({
        repeat: -1, // Loop forever.
        repeatDelay: 2 // Wait 2 seconds between loops.
    });

    flashTimeline.to(cards, {
        scale: 1.05,
        border: "2px solid var(--accent-gold)", // Flash to gold
        duration: 0.5,
        stagger: 0.3, // One by one.
        yoyo: true, // Animates back to original.
        repeat: 1 // Sets it go (on & off).
    });
}

});