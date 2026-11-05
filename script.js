/**
 * Skillmesh - Core JavaScript
 * Brand Identity: Where Skills Connect. Where People Grow.
 * 
 * Handles:
 * 1. Mobile menu toggle & responsive navigation
 * 2. Smooth scrolling navigation links & active section highlighting
 * 3. Interactive skill category filtering & student profile matching
 * 4. CTA button navigation & interactive dialogs
 * 5. Toast notifications and LocalStorage persistence
 * 6. Preserved Phase 1 system & LocalStorage test check
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Skillmesh homepage initialized successfully.');

    // Initialize all homepage interactive components
    initMobileNavigation();
    initSmoothScroll();
    initSmartSkillMatching();       // Smart Skill Matching Engine
    initCategoryFiltering();
    initExchangeRequestManager();   // Skill Exchange Request Management
    initAuthModal();
    initStudentProfile();           // Student Profile Creation & LocalStorage Management
    initSetupCheck();               // Preserved from initial project setup
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');

    if (!toggleBtn || !mobileMenu) return;

    // Toggle menu when clicking hamburger
    toggleBtn.addEventListener('click', () => {
        const isOpen = toggleBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
    });

    // Close menu when clicking any nav link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
            toggleBtn.classList.remove('open');
            mobileMenu.classList.remove('open');
        }
    });
}

/* --------------------------------------------------------------------------
   2. Smooth Scroll & Active Nav Highlighting
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links-desktop a');
    const sections = document.querySelectorAll('section[id], header[id]');

    // Highlight active link on page scroll
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}` || 
               (href === '#explore-matches' && (currentSectionId === 'categories' || currentSectionId === 'explore-matches' || currentSectionId === 'featured-students')) ||
               (href === '#requests-section' && currentSectionId === 'requests-section')) {
                link.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   3. Smart Skill Matching & Peer Exchange Engine
   -------------------------------------------------------------------------- */
const SAMPLE_STUDENTS = [
    {
        id: 'student-maya',
        name: 'Maya Patel',
        college: 'National Institute of Design',
        branch: 'Interaction Design',
        year: '3rd Year',
        category: 'UI/UX Design',
        skillsTeach: ['UI/UX Design', 'Graphic Design'],
        skillsLearn: ['Java', 'HTML', 'CSS'],
        bio: 'Design enthusiast who loves wireframing and building Figma design systems. Eager to learn Java syntax and backend foundations.'
    },
    {
        id: 'student-karan',
        name: 'Karan Mehta',
        college: 'Delhi Technological University',
        branch: 'Computer Science & Engineering',
        year: '2nd Year',
        category: 'Data Science',
        skillsTeach: ['Python', 'Data Science'],
        skillsLearn: ['HTML', 'CSS', 'JavaScript'],
        bio: 'Data science explorer focused on Python and SQL. Looking to learn modern front-end web development to deploy analytical dashboards.'
    },
    {
        id: 'student-ananya',
        name: 'Ananya Iyer',
        college: 'Birla Institute of Technology',
        branch: 'Electronics & Communication',
        year: '4th Year',
        category: 'Communication',
        skillsTeach: ['Communication', 'Public Speaking'],
        skillsLearn: ['Python', 'Data Science'],
        bio: 'University debate finalist and tech conference speaker. Seeking a student to mentor me in Python in exchange for pitch training.'
    },
    {
        id: 'student-devansh',
        name: 'Devansh Rao',
        college: 'Indian Institute of Information Technology',
        branch: 'Information Technology',
        year: '3rd Year',
        category: 'Web Development',
        skillsTeach: ['JavaScript', 'HTML', 'CSS'],
        skillsLearn: ['C++', 'Java'],
        bio: 'Full-stack web builder comfortable with JavaScript. Looking to learn low-level C++ algorithms and object-oriented Java concepts.'
    },
    {
        id: 'student-sneha',
        name: 'Sneha Kulkarni',
        college: 'College of Engineering, Pune',
        branch: 'Computer Engineering',
        year: '2nd Year',
        category: 'Programming',
        skillsTeach: ['C', 'C++'],
        skillsLearn: ['UI/UX Design', 'Communication'],
        bio: 'Competitive coder proficient in C and C++ data structures. Wanting to master UI/UX Design in Figma to make intuitive interfaces.'
    },
    {
        id: 'student-vikram',
        name: 'Vikramaditya Sen',
        college: 'St. Xavier\'s College',
        branch: 'Media & Digital Arts',
        year: '3rd Year',
        category: 'Graphic Design',
        skillsTeach: ['Graphic Design', 'Communication'],
        skillsLearn: ['Python', 'JavaScript'],
        bio: 'Graphic artist skilled in Illustrator and branding. Seeking peer guidance to start programming in Python and JavaScript.'
    }
];

// Active Matching Filter State
const matchFilterState = {
    searchQuery: '',
    selectedSkill: 'all',
    selectedCategoryDomain: null,
    mutualMatchesOnly: false
};

function initSmartSkillMatching() {
    const searchInput = document.getElementById('match-search-input');
    const searchClearBtn = document.getElementById('match-search-clear');
    const skillFilterSelect = document.getElementById('match-skill-filter');
    const mutualOnlyCheckbox = document.getElementById('match-mutual-only-checkbox');
    const resetFiltersBtn = document.getElementById('match-reset-filters-btn');
    const clearAllFiltersBtn = document.getElementById('btn-clear-all-filters');

    // 1. Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            matchFilterState.searchQuery = e.target.value.trim().toLowerCase();
            if (searchClearBtn) {
                searchClearBtn.style.display = matchFilterState.searchQuery ? 'block' : 'none';
            }
            renderMatchResults();
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            matchFilterState.searchQuery = '';
            searchClearBtn.style.display = 'none';
            renderMatchResults();
        });
    }

    // 2. Skill Filter Select
    if (skillFilterSelect) {
        skillFilterSelect.addEventListener('change', (e) => {
            matchFilterState.selectedSkill = e.target.value;
            renderMatchResults();
        });
    }

    // 3. Mutual Only Checkbox
    if (mutualOnlyCheckbox) {
        mutualOnlyCheckbox.addEventListener('change', (e) => {
            matchFilterState.mutualMatchesOnly = e.target.checked;
            renderMatchResults();
        });
    }

    // 4. Reset Filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllMatchingFilters);
    }
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', resetAllMatchingFilters);
    }

    // Initial render on load
    renderMatchResults();
}

function resetAllMatchingFilters() {
    matchFilterState.searchQuery = '';
    matchFilterState.selectedSkill = 'all';
    matchFilterState.selectedCategoryDomain = null;
    matchFilterState.mutualMatchesOnly = false;

    const searchInput = document.getElementById('match-search-input');
    const searchClearBtn = document.getElementById('match-search-clear');
    const skillFilterSelect = document.getElementById('match-skill-filter');
    const mutualOnlyCheckbox = document.getElementById('match-mutual-only-checkbox');

    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    if (skillFilterSelect) skillFilterSelect.value = 'all';
    if (mutualOnlyCheckbox) mutualOnlyCheckbox.checked = false;

    // Reset active category cards in Section 3
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(c => c.classList.remove('active'));
    const categoryFilterBar = document.getElementById('category-filter-bar');
    if (categoryFilterBar) categoryFilterBar.classList.remove('visible');

    renderMatchResults();
    showToast('Matching filters reset to default');
}

/**
 * Calculates reciprocal mutual skill match between a student peer and current user.
 */
function calculateStudentMatch(student, currentUser) {
    if (!currentUser || !Array.isArray(currentUser.skillsTeach) || !Array.isArray(currentUser.skillsLearn)) {
        return {
            ...student,
            isMutualMatch: false,
            isPartialMatch: false,
            exchangeTeach: [],
            exchangeLearn: [],
            matchScore: 0
        };
    }

    const userTeachSet = new Set(currentUser.skillsTeach.map(s => s.toLowerCase()));
    const userLearnSet = new Set(currentUser.skillsLearn.map(s => s.toLowerCase()));

    // Skills the current user teaches that this student peer wants to learn
    const exchangeTeach = currentUser.skillsTeach.filter(userSkill =>
        student.skillsLearn.some(peerSkill => peerSkill.toLowerCase() === userSkill.toLowerCase())
    );

    // Skills this student peer teaches that the current user wants to learn
    const exchangeLearn = student.skillsTeach.filter(peerSkill =>
        userLearnSet.has(peerSkill.toLowerCase())
    );

    // Mutual Match: Both conditions MUST be met!
    const isMutualMatch = exchangeTeach.length > 0 && exchangeLearn.length > 0;
    const isPartialMatch = exchangeTeach.length > 0 || exchangeLearn.length > 0;

    // Scoring to prioritize mutual matches first, then multi-skill overlaps
    let matchScore = 0;
    if (isMutualMatch) {
        matchScore = 200 + (exchangeTeach.length + exchangeLearn.length) * 10;
    } else if (isPartialMatch) {
        matchScore = 50 + (exchangeTeach.length + exchangeLearn.length) * 5;
    }

    return {
        ...student,
        isMutualMatch,
        isPartialMatch,
        exchangeTeach,
        exchangeLearn,
        matchScore
    };
}

/**
 * Renders the match results grid dynamically.
 */
function renderMatchResults() {
    const matchesGrid = document.getElementById('matches-grid');
    const noMatchesCard = document.getElementById('no-matches-card');
    const countLabel = document.getElementById('matches-count-label');
    const activeSkillBadge = document.getElementById('active-skill-filter-badge');
    const contextBar = document.getElementById('matching-context-bar');

    if (!matchesGrid) return;

    // 1. Retrieve current user profile from LocalStorage
    let currentUser = null;
    try {
        const stored = localStorage.getItem('skillmesh_student_profile');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading current profile for matching:', e);
    }

    // 2. Render Context Banner
    renderMatchingContextBar(contextBar, currentUser);

    // 3. Exclude the current student from their own matches
    let candidateStudents = SAMPLE_STUDENTS;
    if (currentUser && currentUser.fullName) {
        const userNameNormalized = currentUser.fullName.trim().toLowerCase();
        candidateStudents = candidateStudents.filter(s => s.name.trim().toLowerCase() !== userNameNormalized);
    }

    // 4. Calculate matches dynamically for each student
    let processedStudents = candidateStudents.map(student => calculateStudentMatch(student, currentUser));

    // 5. Apply Active Filters
    let filteredStudents = processedStudents.filter(student => {
        // Search Filter (name, college, branch, bio)
        if (matchFilterState.searchQuery) {
            const q = matchFilterState.searchQuery;
            const matchesText = student.name.toLowerCase().includes(q) ||
                                student.college.toLowerCase().includes(q) ||
                                student.branch.toLowerCase().includes(q) ||
                                student.bio.toLowerCase().includes(q);
            if (!matchesText) return false;
        }

        // Skill Filter
        if (matchFilterState.selectedSkill && matchFilterState.selectedSkill !== 'all') {
            const skillQuery = matchFilterState.selectedSkill.toLowerCase();
            const hasTeach = student.skillsTeach.some(s => s.toLowerCase() === skillQuery);
            const hasLearn = student.skillsLearn.some(s => s.toLowerCase() === skillQuery);
            if (!hasTeach && !hasLearn) return false;
        }

        // Category Domain Filter (from section 3 click)
        if (matchFilterState.selectedCategoryDomain) {
            const domain = matchFilterState.selectedCategoryDomain.toLowerCase();
            const domainSkillMap = {
                'programming': ['java', 'python', 'c', 'c++'],
                'web development': ['html', 'css', 'javascript'],
                'ui/ux design': ['ui/ux design', 'figma'],
                'graphic design': ['graphic design', 'illustrator'],
                'communication': ['communication', 'public speaking'],
                'data science': ['data science', 'python']
            };
            const domainKeywords = domainSkillMap[domain] || [domain];
            const allStudentSkills = [...student.skillsTeach, ...student.skillsLearn].map(s => s.toLowerCase());
            const matchesDomain = domainKeywords.some(kw => allStudentSkills.some(sk => sk.includes(kw)));
            if (!matchesDomain) return false;
        }

        // Mutual Matches Only Filter
        if (matchFilterState.mutualMatchesOnly) {
            if (!student.isMutualMatch) return false;
        }

        return true;
    });

    // 6. Sort Students: Mutual Matches First, then by matchScore, then name
    filteredStudents.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
        }
        return a.name.localeCompare(b.name);
    });

    // 7. Update Status Strip
    const mutualCount = filteredStudents.filter(s => s.isMutualMatch).length;
    if (countLabel) {
        if (currentUser) {
            countLabel.innerHTML = `Showing <strong>${filteredStudents.length}</strong> student profile${filteredStudents.length === 1 ? '' : 's'} • <span style="color: #20BFA9; font-weight: 700;">${mutualCount} Mutual Match${mutualCount === 1 ? '' : 'es'}</span>`;
        } else {
            countLabel.innerHTML = `Showing <strong>${filteredStudents.length}</strong> student peers available for skill exchange`;
        }
    }

    if (activeSkillBadge) {
        if (matchFilterState.selectedSkill && matchFilterState.selectedSkill !== 'all') {
            activeSkillBadge.textContent = `Skill: ${matchFilterState.selectedSkill}`;
            activeSkillBadge.style.display = 'inline-flex';
        } else if (matchFilterState.selectedCategoryDomain) {
            activeSkillBadge.textContent = `Category: ${matchFilterState.selectedCategoryDomain}`;
            activeSkillBadge.style.display = 'inline-flex';
        } else {
            activeSkillBadge.style.display = 'none';
        }
    }

    // 8. Render Cards or Empty State
    if (filteredStudents.length === 0) {
        matchesGrid.style.display = 'none';
        if (noMatchesCard) noMatchesCard.style.display = 'block';
    } else {
        matchesGrid.style.display = 'grid';
        if (noMatchesCard) noMatchesCard.style.display = 'none';
        matchesGrid.innerHTML = filteredStudents.map(student => createStudentMatchCardHTML(student, currentUser)).join('');
    }
}

/**
 * Creates the HTML markup for a single student match card.
 */
function createStudentMatchCardHTML(student, currentUser) {
    const isMutual = student.isMutualMatch;
    const isPartial = student.isPartialMatch && !isMutual;

    // Generate initials for avatar
    const nameParts = student.name.split(' ');
    const initials = nameParts.length > 1 ? nameParts[0][0] + nameParts[1][0] : nameParts[0][0];

    // Card class modifier
    const cardClass = isMutual ? 'student-card card-mutual-match' : 'student-card';

    // Mutual Match Indicator Badge
    let matchBadgeHTML = '';
    if (isMutual) {
        matchBadgeHTML = `
            <div class="match-status-badge-wrap">
                <span class="mutual-match-badge"><span class="sparkle">⚡</span> MUTUAL EXCHANGE MATCH</span>
            </div>
        `;
    } else if (isPartial) {
        matchBadgeHTML = `
            <div class="match-status-badge-wrap">
                <span class="partial-match-badge">Potential Exchange</span>
            </div>
        `;
    }

    // Exchange Highlight Box (Skills Available for Mutual Exchange)
    let exchangeHighlightHTML = '';
    if (isMutual && currentUser) {
        exchangeHighlightHTML = `
            <div class="exchange-highlight-box mutual-highlight">
                <span class="exchange-highlight-title">🤝 Available for Mutual Exchange:</span>
                <div class="exchange-flow">
                    <span class="flow-item">You teach: <strong>${student.exchangeTeach.join(', ')}</strong></span>
                    <span class="flow-arrow">⇄</span>
                    <span class="flow-item">${student.name} teaches: <strong>${student.exchangeLearn.join(', ')}</strong></span>
                </div>
            </div>
        `;
    } else if (isPartial && currentUser) {
        if (student.exchangeLearn.length > 0) {
            exchangeHighlightHTML = `
                <div class="exchange-highlight-box partial-highlight">
                    <span class="exchange-highlight-title">💡 One-Way Fit:</span>
                    <span class="flow-item">${student.name} can teach you: <strong>${student.exchangeLearn.join(', ')}</strong></span>
                </div>
            `;
        } else if (student.exchangeTeach.length > 0) {
            exchangeHighlightHTML = `
                <div class="exchange-highlight-box partial-highlight">
                    <span class="exchange-highlight-title">💡 One-Way Fit:</span>
                    <span class="flow-item">You can teach ${student.name}: <strong>${student.exchangeTeach.join(', ')}</strong></span>
                </div>
            `;
        }
    }

    // Skill pills
    const teachPills = student.skillsTeach.map(s => `<span class="skill-pill skill-pill-teach">${s}</span>`).join('');
    const learnPills = student.skillsLearn.map(s => `<span class="skill-pill skill-pill-learn">${s}</span>`).join('');

    return `
        <article class="${cardClass}" data-id="${student.id}">
            ${matchBadgeHTML}
            <div class="student-card-header">
                <div class="student-avatar">${initials}</div>
                <div>
                    <h3 class="student-name">${student.name}</h3>
                    <p class="student-meta">${student.branch} • ${student.year}</p>
                    <p class="student-meta" style="font-size: 0.775rem; color: #878ca5;">${student.college}</p>
                </div>
            </div>

            ${exchangeHighlightHTML}

            <!-- Teaching Skills -->
            <div class="exchange-section">
                <div class="exchange-heading heading-teach">
                    <span>Teaches</span>
                    <span>(Can Share)</span>
                </div>
                <div class="skills-pill-wrap">
                    ${teachPills}
                </div>
            </div>

            <!-- Wants to Learn Skills -->
            <div class="exchange-section">
                <div class="exchange-heading heading-learn">
                    <span>Wants to Learn</span>
                    <span>(Seeking)</span>
                </div>
                <div class="skills-pill-wrap">
                    ${learnPills}
                </div>
            </div>

            <div class="student-card-footer">
                <button type="button" class="btn-request-match" data-student="${student.name}">
                    Request Exchange
                </button>
            </div>
        </article>
    `;
}

/**
 * Renders current user's matching context banner.
 */
function renderMatchingContextBar(contextBar, currentUser) {
    if (!contextBar) return;

    if (currentUser && currentUser.fullName) {
        const teachStr = (currentUser.skillsTeach || []).join(', ') || 'None';
        const learnStr = (currentUser.skillsLearn || []).join(', ') || 'None';
        const initials = currentUser.fullName.trim()[0].toUpperCase();

        contextBar.innerHTML = `
            <div class="context-user-info">
                <div class="context-avatar-dot">${initials}</div>
                <div>
                    <div class="context-text">Matching based on your active profile: <strong>${currentUser.fullName}</strong> (${currentUser.branch || 'Student'})</div>
                    <div class="context-skills-summary">
                        <span style="color: #0d7567; font-weight: 700;">You Teach:</span> ${teachStr} &nbsp;•&nbsp;
                        <span style="color: #6D4AFF; font-weight: 700;">You Seek:</span> ${learnStr}
                    </div>
                </div>
            </div>
            <div>
                <a href="#profile-section" class="context-action-link">✏️ Edit My Profile</a>
            </div>
        `;
    } else {
        contextBar.innerHTML = `
            <div class="context-user-info">
                <span style="font-size: 1.5rem;">💡</span>
                <div>
                    <div class="context-text"><strong>Personalized Mutual Matching:</strong> Create your student profile to unlock reciprocal match calculation.</div>
                    <div class="context-skills-summary">Currently displaying the live student exchange peer catalog.</div>
                </div>
            </div>
            <div>
                <a href="#profile-section" class="btn btn-primary btn-sm">Create Profile</a>
            </div>
        `;
    }
}

/* --------------------------------------------------------------------------
   4. Integration with Popular Skill Category Cards
   -------------------------------------------------------------------------- */
function initCategoryFiltering() {
    const categoryCards = document.querySelectorAll('.category-card');
    const filterBar = document.getElementById('category-filter-bar');
    const activeCategoryLabel = document.getElementById('active-category-name');
    const clearFilterBtn = document.getElementById('btn-clear-filter');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.getAttribute('data-category');

            if (matchFilterState.selectedCategoryDomain === categoryName) {
                // If clicked again, reset filter
                matchFilterState.selectedCategoryDomain = null;
                categoryCards.forEach(c => c.classList.remove('active'));
                if (filterBar) filterBar.classList.remove('visible');
                showToast('Showing all categories');
            } else {
                // Apply category domain filter
                matchFilterState.selectedCategoryDomain = categoryName;
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                if (filterBar && activeCategoryLabel) {
                    activeCategoryLabel.textContent = categoryName;
                    filterBar.classList.add('visible');
                }
                showToast(`Filtered peer matches by: ${categoryName}`);
            }

            renderMatchResults();

            // Smoothly scroll down to the explore matches section
            const matchesSection = document.getElementById('explore-matches');
            if (matchesSection) {
                matchesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            matchFilterState.selectedCategoryDomain = null;
            categoryCards.forEach(c => c.classList.remove('active'));
            if (filterBar) filterBar.classList.remove('visible');
            renderMatchResults();
            showToast('Showing all categories');
        });
    }
}

/* --------------------------------------------------------------------------
   5. Dynamic Student Exchange Requests Event Delegation
   -------------------------------------------------------------------------- */
function initStudentExchangeRequests() {
    // Use event delegation on document so dynamically rendered cards always respond
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-request-match');
        if (!btn) return;

        const studentName = btn.getAttribute('data-student') || 'Student';

        // Save exchange request in LocalStorage
        try {
            const requests = JSON.parse(localStorage.getItem('skillmesh_exchange_requests') || '[]');
            const newRequest = {
                student: studentName,
                requestedAt: new Date().toISOString()
            };
            requests.push(newRequest);
            localStorage.setItem('skillmesh_exchange_requests', JSON.stringify(requests));
        } catch (err) {
            console.error('Error saving request to LocalStorage', err);
        }

        // Visual feedback using Growth Teal
        const originalText = btn.textContent;
        btn.textContent = '✓ Request Sent!';
        btn.style.backgroundColor = '#20BFA9';
        btn.style.color = '#ffffff';

        showToast(`Skill exchange invitation sent to ${studentName}!`);

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 2500);
    });
}

/* --------------------------------------------------------------------------
   5. Interactive Authentication / Get Started Modal
   -------------------------------------------------------------------------- */
function initAuthModal() {
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const loginNavBtn = document.getElementById('nav-login-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const ctaGetStartedBtn = document.getElementById('cta-get-started-btn');
    const authForm = document.getElementById('auth-form');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');

    if (!modal) return;

    function openModal(title, subtitle) {
        if (modalTitle && title) modalTitle.textContent = title;
        if (modalSubtitle && subtitle) modalSubtitle.textContent = subtitle;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', () => {
            openModal('Log In to Skillmesh', 'Access your skill exchanges and student peer network.');
        });
    }

    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            openModal('Log In to Skillmesh', 'Access your skill exchanges and student peer network.');
        });
    }

    if (ctaGetStartedBtn) {
        ctaGetStartedBtn.addEventListener('click', () => {
            openModal('Join Skillmesh Today', 'Teach what you know, learn what you love for free.');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking modal backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Handle form submission
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('auth-email');
            const skillInput = document.getElementById('auth-skill-teach');

            const email = emailInput ? emailInput.value.trim() : '';
            const skill = skillInput ? skillInput.value.trim() : '';

            if (email) {
                // Store user session state in LocalStorage
                localStorage.setItem('skillmesh_user', JSON.stringify({ email, skill, loggedInAt: new Date().toISOString() }));
                showToast(`Welcome to Skillmesh, ${email.split('@')[0]}!`);
                closeModal();
                if (emailInput) emailInput.value = '';
                if (skillInput) skillInput.value = '';
            }
        });
    }
}

/* --------------------------------------------------------------------------
   6. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/* --------------------------------------------------------------------------
   7. Preserved Setup & LocalStorage Verification (Phase 1)
   -------------------------------------------------------------------------- */
function isLocalStorageAvailable() {
    try {
        const testKey = '__skillmesh_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

function initSetupCheck() {
    const testButton = document.getElementById('test-btn');
    const feedbackEl = document.getElementById('status-feedback');

    if (!testButton || !feedbackEl) return;

    testButton.addEventListener('click', () => {
        const storageReady = isLocalStorageAvailable();

        if (storageReady) {
            const initializedAt = new Date().toLocaleTimeString();
            localStorage.setItem('skillmesh_initialized', initializedAt);

            feedbackEl.textContent = `✅ Operational! LocalStorage active and responsive (${initializedAt}).`;
            feedbackEl.style.color = '#20BFA9';
            showToast('LocalStorage check passed successfully!');
        } else {
            feedbackEl.textContent = '⚠️ Warning: LocalStorage is disabled or unavailable.';
            feedbackEl.style.color = '#ef4444';
        }
    });
}

/* --------------------------------------------------------------------------
   8. Student Profile Creation & LocalStorage Management
   -------------------------------------------------------------------------- */
const PROFILE_STORAGE_KEY = 'skillmesh_student_profile';

function initStudentProfile() {
    const profileForm = document.getElementById('student-profile-form');
    if (!profileForm) return;

    const errorAlert = document.getElementById('profile-form-error');
    const successAlert = document.getElementById('profile-form-success');
    const resetBtn = document.getElementById('profile-reset-btn');
    const submitBtn = document.getElementById('profile-submit-btn');
    const formTitle = document.getElementById('form-header-title');

    const teachCheckboxes = document.querySelectorAll('input[name="skillsTeach"]');
    const learnCheckboxes = document.querySelectorAll('input[name="skillsLearn"]');

    // 1. Setup Mutual Conflict Prevention
    setupSkillConflictPrevention(teachCheckboxes, learnCheckboxes);

    // 2. Load existing profile from LocalStorage on page load
    loadSavedProfile();

    // 3. Form Submit Handler
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAlerts();

        const nameInput = document.getElementById('profile-name');
        const collegeInput = document.getElementById('profile-college');
        const branchInput = document.getElementById('profile-branch');
        const yearSelect = document.getElementById('profile-year');
        const bioInput = document.getElementById('profile-bio');

        const fullName = nameInput ? nameInput.value.trim() : '';
        const collegeName = collegeInput ? collegeInput.value.trim() : '';
        const branch = branchInput ? branchInput.value.trim() : '';
        const yearOfStudy = yearSelect ? yearSelect.value : '';
        const bio = bioInput ? bioInput.value.trim() : '';

        // Collect selected skills
        const skillsTeach = [];
        teachCheckboxes.forEach(cb => {
            if (cb.checked) skillsTeach.push(cb.value);
        });

        const skillsLearn = [];
        learnCheckboxes.forEach(cb => {
            if (cb.checked) skillsLearn.push(cb.value);
        });

        // Validation
        const validationError = validateProfileForm(fullName, collegeName, branch, yearOfStudy, skillsTeach, skillsLearn);
        if (validationError) {
            showErrorAlert(validationError);
            return;
        }

        // Construct Profile Object
        const profileData = {
            fullName,
            collegeName,
            branch,
            yearOfStudy,
            bio: bio || "Ready to exchange skills and connect with peers on Skillmesh!",
            skillsTeach,
            skillsLearn,
            savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        // Save to LocalStorage
        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
            showSuccessAlert('Profile saved successfully! Your student exchange card is now active.');
            showToast('Student profile saved successfully!');
            renderSavedProfileCard(profileData);
            if (submitBtn) submitBtn.textContent = 'Update Profile';
            if (formTitle) formTitle.textContent = 'Edit Your Profile';
            // Recalculate smart matches in real-time
            renderMatchResults();
        } catch (err) {
            console.error('Error saving profile to LocalStorage:', err);
            showErrorAlert('Could not save to LocalStorage. Please check browser permissions.');
        }
    });

    // 4. Form Reset Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            profileForm.reset();
            hideAlerts();
            syncSkillConflictState();
            if (submitBtn) submitBtn.textContent = 'Save Profile';
            if (formTitle) formTitle.textContent = 'Student Registration Form';
        });
    }

    // 5. Edit Button Handler
    const editBtn = document.getElementById('btn-edit-profile');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            populateFormWithSavedProfile();
            const formSection = document.getElementById('profile-section');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const nameInput = document.getElementById('profile-name');
            if (nameInput) nameInput.focus();
            showToast('Loaded profile details into form for editing.');
        });
    }

    // 6. Delete / Clear Profile Handler
    const deleteBtn = document.getElementById('btn-delete-profile');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your saved profile from LocalStorage?')) {
                localStorage.removeItem(PROFILE_STORAGE_KEY);
                profileForm.reset();
                hideAlerts();
                syncSkillConflictState();
                toggleProfileDisplay(false);
                if (submitBtn) submitBtn.textContent = 'Save Profile';
                if (formTitle) formTitle.textContent = 'Student Registration Form';
                showToast('Profile cleared from LocalStorage.');
                // Recalculate smart matches in real-time
                renderMatchResults();
            }
        });
    }

    function hideAlerts() {
        if (errorAlert) errorAlert.style.display = 'none';
        if (successAlert) successAlert.style.display = 'none';
    }

    function showErrorAlert(msg) {
        if (errorAlert) {
            errorAlert.textContent = `⚠️ ${msg}`;
            errorAlert.style.display = 'flex';
            errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast(msg);
    }

    function showSuccessAlert(msg) {
        if (successAlert) {
            successAlert.textContent = `✅ ${msg}`;
            successAlert.style.display = 'flex';
        }
    }
}

/**
 * Mutual exclusion: prevents the exact same skill from being checked in both
 * "Skills I Can Teach" and "Skills I Want to Learn".
 */
function setupSkillConflictPrevention(teachBoxes, learnBoxes) {
    teachBoxes.forEach(teachCb => {
        teachCb.addEventListener('change', () => {
            syncSkillConflictState();
        });
    });

    learnBoxes.forEach(learnCb => {
        learnCb.addEventListener('change', () => {
            syncSkillConflictState();
        });
    });
}

function syncSkillConflictState() {
    const teachCheckboxes = document.querySelectorAll('input[name="skillsTeach"]');
    const learnCheckboxes = document.querySelectorAll('input[name="skillsLearn"]');

    // Create a set of currently checked teach skills
    const checkedTeachSkills = new Set();
    teachCheckboxes.forEach(cb => {
        if (cb.checked) checkedTeachSkills.add(cb.value);
    });

    // Create a set of currently checked learn skills
    const checkedLearnSkills = new Set();
    learnCheckboxes.forEach(cb => {
        if (cb.checked) checkedLearnSkills.add(cb.value);
    });

    // Lock/Unlock learn checkboxes if selected in teach
    learnCheckboxes.forEach(cb => {
        const parentLabel = cb.closest('.skill-tag-item');
        if (checkedTeachSkills.has(cb.value)) {
            cb.checked = false;
            cb.disabled = true;
            if (parentLabel) {
                parentLabel.classList.add('disabled-conflict');
                parentLabel.setAttribute('title', `"${cb.value}" is already selected in Skills I Can Teach`);
            }
        } else {
            cb.disabled = false;
            if (parentLabel) {
                parentLabel.classList.remove('disabled-conflict');
                parentLabel.removeAttribute('title');
            }
        }
    });

    // Lock/Unlock teach checkboxes if selected in learn
    teachCheckboxes.forEach(cb => {
        const parentLabel = cb.closest('.skill-tag-item');
        if (checkedLearnSkills.has(cb.value)) {
            cb.checked = false;
            cb.disabled = true;
            if (parentLabel) {
                parentLabel.classList.add('disabled-conflict');
                parentLabel.setAttribute('title', `"${cb.value}" is already selected in Skills I Want to Learn`);
            }
        } else {
            cb.disabled = false;
            if (parentLabel) {
                parentLabel.classList.remove('disabled-conflict');
                parentLabel.removeAttribute('title');
            }
        }
    });
}

/**
 * Validates that all required fields are present and valid.
 */
function validateProfileForm(name, college, branch, year, teachSkills, learnSkills) {
    if (!name) return 'Please enter your full name.';
    if (name.length < 2) return 'Full name must be at least 2 characters.';
    if (!college) return 'Please enter your college or university name.';
    if (!branch) return 'Please specify your academic branch or major.';
    if (!year) return 'Please select your current year of study.';
    if (teachSkills.length === 0) return 'Please select at least one skill you can teach.';
    if (learnSkills.length === 0) return 'Please select at least one skill you want to learn.';
    return null; // Valid
}

/**
 * Renders the saved profile card in the DOM.
 */
function renderSavedProfileCard(profile) {
    const savedCard = document.getElementById('saved-profile-card');
    if (!savedCard) return;

    // Calculate avatar initials
    const nameParts = profile.fullName.trim().split(/\s+/);
    let initials = nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length > 1) {
        initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    }

    const avatarEl = document.getElementById('saved-card-avatar');
    const nameEl = document.getElementById('saved-card-name');
    const collegeEl = document.getElementById('saved-card-college');
    const branchEl = document.getElementById('saved-card-branch');
    const yearEl = document.getElementById('saved-card-year');
    const bioEl = document.getElementById('saved-card-bio');
    const timestampEl = document.getElementById('profile-saved-timestamp');
    const teachContainer = document.getElementById('saved-card-teach-skills');
    const learnContainer = document.getElementById('saved-card-learn-skills');

    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = profile.fullName;
    if (collegeEl) collegeEl.textContent = profile.collegeName;
    if (branchEl) branchEl.textContent = profile.branch;
    if (yearEl) yearEl.textContent = profile.yearOfStudy;
    if (bioEl) bioEl.textContent = `"${profile.bio}"`;
    if (timestampEl) timestampEl.textContent = `Saved: ${profile.savedAt || 'Active'}`;

    if (teachContainer) {
        teachContainer.innerHTML = '';
        profile.skillsTeach.forEach(skill => {
            const pill = document.createElement('span');
            pill.className = 'skill-pill skill-pill-teach';
            pill.textContent = skill;
            teachContainer.appendChild(pill);
        });
    }

    if (learnContainer) {
        learnContainer.innerHTML = '';
        profile.skillsLearn.forEach(skill => {
            const pill = document.createElement('span');
            pill.className = 'skill-pill skill-pill-learn';
            pill.textContent = skill;
            learnContainer.appendChild(pill);
        });
    }

    toggleProfileDisplay(true);
}

function toggleProfileDisplay(hasProfile) {
    const savedCard = document.getElementById('saved-profile-card');
    const emptyCard = document.getElementById('empty-profile-card');
    if (savedCard && emptyCard) {
        if (hasProfile) {
            savedCard.style.display = 'block';
            emptyCard.style.display = 'none';
        } else {
            savedCard.style.display = 'none';
            emptyCard.style.display = 'block';
        }
    }
}

/**
 * Loads the saved profile from browser LocalStorage if it exists.
 */
function loadSavedProfile() {
    try {
        const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (savedData) {
            const profile = JSON.parse(savedData);
            renderSavedProfileCard(profile);
            populateFormWithSavedProfile(profile);
            const submitBtn = document.getElementById('profile-submit-btn');
            const formTitle = document.getElementById('form-header-title');
            if (submitBtn) submitBtn.textContent = 'Update Profile';
            if (formTitle) formTitle.textContent = 'Edit Your Profile';
        } else {
            toggleProfileDisplay(false);
        }
    } catch (e) {
        console.error('Error loading saved profile:', e);
        toggleProfileDisplay(false);
    }
}

/**
 * Populates form inputs with the saved profile data for editing.
 */
function populateFormWithSavedProfile(profileData) {
    const profile = profileData || JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null');
    if (!profile) return;

    const nameInput = document.getElementById('profile-name');
    const collegeInput = document.getElementById('profile-college');
    const branchInput = document.getElementById('profile-branch');
    const yearSelect = document.getElementById('profile-year');
    const bioInput = document.getElementById('profile-bio');

    if (nameInput) nameInput.value = profile.fullName || '';
    if (collegeInput) collegeInput.value = profile.collegeName || '';
    if (branchInput) branchInput.value = profile.branch || '';
    if (yearSelect) yearSelect.value = profile.yearOfStudy || '';
    if (bioInput) bioInput.value = profile.bio || '';

    // Check teach boxes
    const teachCheckboxes = document.querySelectorAll('input[name="skillsTeach"]');
    teachCheckboxes.forEach(cb => {
        cb.checked = (profile.skillsTeach || []).includes(cb.value);
    });

    // Check learn boxes
    const learnCheckboxes = document.querySelectorAll('input[name="skillsLearn"]');
    learnCheckboxes.forEach(cb => {
        cb.checked = (profile.skillsLearn || []).includes(cb.value);
    });

    syncSkillConflictState();
}
