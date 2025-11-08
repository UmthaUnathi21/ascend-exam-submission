'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Onboarding form.
    const onboardingFormContainer = document.getElementById('onboarding-form-container');
    const newUserForm = document.getElementById('new-user-form');
    
    // Main dashboard.
    const mainDashboardContent = document.getElementById('main-dashboard-content');
    
    // Correct page checker i.e dashboard page
    if (!mainDashboardContent) {
        return; 
    }

    // Summary header.
    const welcomeTitle = document.querySelector('.welcome-title');
    const currentSalaryEl = document.getElementById('current-salary-num');
    const goalSalaryEl = document.getElementById('goal-salary-num');
    const careerFieldEl = document.getElementById('career-field-text');
    
    // Milestone elements.
    const milestonesListContainer = document.getElementById('milestones-list');
    const addMilestoneForm = document.getElementById('add-milestone-form');


    //Core data functions.
    function loadUserData() {
        const savedData = localStorage.getItem('ascendUserData');
        return savedData ? JSON.parse(savedData) : null;
    }

    function saveUserData(data) {
        localStorage.setItem('ascendUserData', JSON.stringify(data));
    }


    //State controller.

    function showOnboardingForm() {
        mainDashboardContent.classList.add('hidden');
        onboardingFormContainer.classList.remove('hidden');
    }

    function showMainDashboard(data) {
        onboardingFormContainer.classList.add('hidden');
        mainDashboardContent.classList.remove('hidden');
        
        populateDashboard(data);
    }


    //UI logic.

    function populateDashboard(data) {
        const graphCurrentSalary = document.getElementById('graph-current-salary');
        const graphGoalSalary = document.getElementById('graph-goal-salary');

        //Populate.
        welcomeTitle.textContent = `Welcome, ${data.name}!`;
        careerFieldEl.textContent = data.career;

        graphCurrentSalary.textContent = `$${data.currentSalary.toLocaleString()}`;
        graphGoalSalary.textContent = `$${data.desiredSalary.toLocaleString()}`;
        
        //Animate the header summary.
        runHeaderAnimation(data.currentSalary, data.desiredSalary);

        //Render the dynamic milestones list.
        renderMilestones(data.milestones);
        
        //Animate the graph.
        gsap.to("#trajectory-path", {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".trajectory-graph",
                start: "top 60%",
                toggleActions: "play none none none"
            }
        });
    }

    function runHeaderAnimation(currentSalary, desiredSalary) {
        const counters = { current: 0, goal: 0 };
        
        gsap.timeline()
            .to(".welcome-title", { opacity: 1, duration: 0.5, ease: "power2.out" })
            .to(".summary-metric", { opacity: 1, stagger: 0.2, duration: 0.5 }, "-=0.3")
            .to(counters, {
                duration: 1.5,
                current: currentSalary || 0,
                goal: desiredSalary || 0,
                ease: "power3.out",
                onUpdate: () => {
                    if(currentSalaryEl) currentSalaryEl.textContent = Math.round(counters.current).toLocaleString();
                    if(goalSalaryEl) goalSalaryEl.textContent = Math.round(counters.goal).toLocaleString();
                }
            }, "-=0.5");
    }

    function renderMilestones(milestones) {
        if (!milestonesListContainer) return;
        
        milestonesListContainer.innerHTML = ''; 

        if (!milestones || milestones.length === 0) {
            milestonesListContainer.innerHTML = '<p>No milestones added yet. Add one below!</p>';
            return;
        }

        milestones.forEach((item, index) => {
            const milestoneEl = document.createElement('div');
            milestoneEl.className = 'milestone-item';
            milestoneEl.innerHTML = `
                <h4>${item.year}: ${item.text}</h4>
                <button class="btn-remove-milestone" data-index="${index}">&times;</button>
            `;
            milestonesListContainer.appendChild(milestoneEl);
        });

        gsap.fromTo(".milestone-item", 
            { opacity: 0, x: 50 }, 
            { opacity: 1, x: 0, stagger: 0.1, duration: 0.5 }
        );

        renderGraphCheckpoints(milestones); 
    }
    
    function renderGraphCheckpoints(milestones) {
        const graph = document.querySelector('.graph-container svg');
        if (!graph || !milestones) return;

        graph.querySelectorAll('.milestone-checkpoint').forEach(c => c.remove());

        const startYear = 2025;
        const endYear = 2031;
        const yearSpan = endYear - startYear; 
        const startX = 50;  
        const endX = 550;   
        const graphWidth = endX - startX; 

        milestones.forEach(item => {
            const year = item.year;
            if (year >= startYear && year <= endYear) {
                const percent = (year - startYear) / yearSpan;
                const xPos = startX + (percent * graphWidth);
                const yPos = 190; 
                
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "milestone-checkpoint");
                circle.setAttribute("cx", xPos);
                circle.setAttribute("cy", yPos);
                circle.setAttribute("r", "5");
                circle.setAttribute("fill", "var(--accent-gold)");
                
                const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                title.textContent = `${item.year}: ${item.text}`;
                circle.appendChild(title);
                graph.appendChild(circle);
            }
        });

        gsap.from(".milestone-checkpoint", {
            r: 0,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });
    }


    if (newUserForm) {
        newUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newData = {
                name: document.getElementById('user-name').value,
                age: parseInt(document.getElementById('user-age').value),
                career: document.getElementById('user-career').value,
                currentSalary: parseFloat(document.getElementById('user-current-salary').value),
                desiredSalary: parseFloat(document.getElementById('user-desired-salary').value),
                milestones: [] 
            };
            
            saveUserData(newData);
            showMainDashboard(newData);
        });
    }

    if (addMilestoneForm) {
        addMilestoneForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newText = document.getElementById('new-milestone-text').value;
            const newYear = parseInt(document.getElementById('new-milestone-year').value);

            if (newText && newYear) {
                const data = loadUserData();
                if (!data.milestones) data.milestones = [];
                
                data.milestones.push({ text: newText, year: newYear });
                data.milestones.sort((a, b) => a.year - b.year);
                
                saveUserData(data); 
                renderMilestones(data.milestones);
                
                document.getElementById('new-milestone-text').value = '';
                document.getElementById('new-milestone-year').value = '';
            }
        });
    }

    if (milestonesListContainer) {
        milestonesListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-milestone')) {
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                
                if (confirm('Are you sure you want to remove this milestone?')) {
                    const data = loadUserData();
                    data.milestones.splice(indexToRemove, 1);
                    saveUserData(data);
                    renderMilestones(data.milestones);
                }
            }
        });
    }

    //The controller.

    function init() {
        const data = loadUserData();
        
        if (data === null) {
            // STATE 1: No data, show the setup form.
            showOnboardingForm();
        } else {
            // STATE 2: Data exists, show the main dashboard.
            showMainDashboard(data);
        }
    }
    
    init();

}); 