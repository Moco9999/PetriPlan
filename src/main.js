import './style.css';

/** 
 * --- HARDCODED AUTH SYSTEM ---
 * Simple username/password map as requested.
 */
const AUTH_USERS = {
    "annmaryjoseph": "adminpetri9999"
};

// --- DATA ---
const labData = {
    pi: { 
        name: "Dr. Rakesh S. Laishram", 
        title: "PhD, FNASc",
        role: "Scientist F & Swarna Jayanti Fellow",
        bio: "Deciphering the molecular language of RNA processing to heal the failing heart and restore cardiac function."
    },
    team: [
        { name: "Malaya Ranjan Behera", role: "PhD Student", focus: "Non-coding RNA processing." },
        { name: "Diksha Singh", role: "PhD Student", focus: "3'-end formation pathways." },
        { name: "Beauty Rani Koch", role: "PhD Student", focus: "Star-PAP phosphorylation." },
        { name: "Unnimaya Sajeev", role: "PhD Student", focus: "RBM10 expression & hypertrophy." },
        { name: "Revathy A S", role: "PhD Student", focus: "RNA-protein interactions." },
        { name: "Babitha", role: "PhD Student", focus: "Molecular mechanism of Preeclampsia." },
        { name: "Ann Mary Joseph", role: "PhD Student", focus: "RNA-based epigenetic changes in hypertrophy and heart failure." },
        { name: "Ciji Varghese", role: "Chief Manager", focus: "Technical & lab services." }
    ],
    publications: [
        {
            title: "Tyrosine phosphorylation controlled poly(A) polymerase I activity regulates general stress response in bacteria",
            journal: "Life Science Alliance (2022)",
            authors: "Nimmy Francis, Malaya R Behera, Kathiresan Natarajan, Rakesh S Laishram",
            url: "https://doi.org/10.26508/lsa.202101148"
        },
        {
            title: "Star-PAP RNA Binding Landscape Reveals Novel Role of Star-PAP in mRNA Metabolism That Requires RBM10-RNA Association",
            journal: "International Journal of Molecular Sciences (2021)",
            authors: "Ganesh R. Koshre, Feba Shaji, Neeraja K. Mohanan, et al.",
            url: "https://doi.org/10.3390/ijms22189980"
        },
        {
            title: "Transgenesis of mammalian PABP reveals mRNA polyadenylation as a general stress response mechanism in bacteria",
            journal: "iScience (2021)",
            authors: "Francis N., Laishram R. S.",
            url: "https://doi.org/10.1016/j.isci.2021.103119"
        },
        {
            title: "Alternative polyadenylation: An enigma of transcript length variation in health and disease",
            journal: "Wiley Interdiscip Rev RNA (2021)",
            authors: "Neeraja K Mohanan, Feba Shaji, Ganesh R Koshre, Rakesh S Laishram",
            url: "https://doi.org/10.1002/wrna.1692"
        },
        {
            title: "Star-PAP controlled alternative polyadenylation coupled poly(A) tail length regulates expression in hypertrophic heart",
            journal: "Nucleic Acid Res. (2019)",
            authors: "Sudheesh, A.P., Mohan, N., Nimmy, F., Rakesh S. Laishram*, et al.",
            url: "https://doi.org/10.1093/nar/gkz875"
        },
        {
            title: "A splicing-independent function of RBM10 controls specific 3'UTR processing to regulate cardiac hypertrophy",
            journal: "Cell Reports (2018)",
            authors: "Mohan, N., Kumar, V., Kandala, D., C.C. Kartha, Rakesh S. Laishram",
            url: "https://doi.org/10.1016/j.celrep.2018.08.077"
        }
    ],
    facilities: [
        { id: "cell", name: "Cell Culture", icon: "biotech" },
        { id: "bacterial", name: "Bacterial Culture", icon: "science" },
        { id: "equipment", name: "Equipment", icon: "settings_suggest", options: ["PCR", "qRT-PCR"] }
    ]
};

// --- SECURE STATE ---
const State = {
    user: JSON.parse(localStorage.getItem('petriplan_user') || 'null'),
    bookings: JSON.parse(localStorage.getItem('petriplan_v7_bookings') || '[]'),
    currentMonth: new Date(),
    selectedDate: null,
    selectedStart: null,
    selectedEnd: null,
    selectedFacility: "cell",
    selectedSubOption: null,
    isAdmin: false
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    renderTeam();
    renderPubs();
    
    // Check local session
    if (State.user) {
        syncUser(State.user);
    } else {
        updateAuthUI();
    }

    renderCalendar();
    
    window.navigateTo = navigateTo;
    window.scrollToSection = scrollToSection;
    window.toggleLoginModal = toggleLoginModal;
    window.handleAuthAction = handleAuthAction;
    window.changeMonth = changeMonth;
    window.selectDate = selectDate;
    window.updateTimes = updateTimes;
    window.finalizeBooking = finalizeBooking;
    window.logout = logout;
    window.selectFacility = selectFacility;
    window.selectSubOption = selectSubOption;
}

function syncUser(userData) {
    const adminEmail = "annmaryjoseph";
    State.user = userData;
    State.isAdmin = userData.username === adminEmail;
    localStorage.setItem('petriplan_user', JSON.stringify(userData));
    updateAuthUI();
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active');
    const header = document.getElementById('main-header');
    if (pageId === 'home') header.classList.remove('-translate-y-full');
    else header.classList.add('-translate-y-full');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.toggle('active');
}

function handleAuthAction() {
    const user = document.getElementById('auth-user').value;
    const pass = document.getElementById('auth-pass').value;
    const errorEl = document.getElementById('auth-error');

    if (AUTH_USERS[user] && AUTH_USERS[user] === pass) {
        errorEl.classList.add('hidden');
        syncUser({ username: user, name: user.charAt(0).toUpperCase() + user.slice(1) });
        toggleLoginModal();
    } else {
        errorEl.classList.remove('hidden');
        errorEl.innerText = "Invalid credentials. Access Denied.";
    }
}

function logout() {
    State.user = null;
    State.isAdmin = false;
    localStorage.removeItem('petriplan_user');
    updateAuthUI();
    navigateTo('home');
}

function updateAuthUI() {
    const authBox = document.getElementById('header-auth');
    const bookStatus = document.getElementById('book-status-box');
    const bookBtn = document.getElementById('confirm-booking-btn');
    const adminPanel = document.getElementById('admin-dashboard');

    if (State.user) {
        authBox.innerHTML = `
            <div class="flex items-center gap-4 cursor-pointer group" onclick="logout()">
                <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-white group-hover:text-primary transition-all">${State.user.name}</p>
                    <p class="text-[9px] text-primary/50 uppercase tracking-[0.3em]">${State.isAdmin ? 'Admin' : 'Researcher'}</p>
                </div>
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg bg-primary flex items-center justify-center text-black font-bold">
                    ${State.user.name.charAt(0)}
                </div>
            </div>
        `;
        if (bookStatus) bookStatus.innerHTML = `<span class="text-primary font-bold">Logged In:</span> ${State.user.username}`;
        if (bookBtn) {
            bookBtn.disabled = false;
            bookBtn.classList.remove('opacity-20', 'cursor-not-allowed');
            bookBtn.classList.add('bg-primary', 'text-black');
            bookBtn.innerText = "Confirm Session";
        }
        if (State.isAdmin && adminPanel) adminPanel.classList.remove('hidden');
        else if (adminPanel) adminPanel.classList.add('hidden');
    } else {
        authBox.innerHTML = `<button onclick="toggleLoginModal()" class="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10">Signin</button>`;
        if (bookStatus) bookStatus.innerHTML = `Login to continue`;
        if (bookBtn) { 
            bookBtn.disabled = true; 
            bookBtn.classList.add('opacity-20');
            bookBtn.innerText = "Login to Continue";
        }
    }
}

function renderPubs() {
    const grid = document.getElementById('pub-grid');
    if (!grid) return;
    grid.innerHTML = labData.publications.map(p => `
        <a href="${p.url}" target="_blank" class="block p-8 glass-panel rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group shadow-sm">
            <div class="flex justify-between items-start gap-8">
                <div class="space-y-4">
                    <h4 class="font-headline text-2xl font-bold text-white group-hover:text-primary transition-all leading-snug">${p.title}</h4>
                    <p class="text-sm text-white/40 italic font-light">${p.authors}</p>
                    <p class="text-[10px] text-primary font-bold uppercase tracking-[0.3em]">${p.journal}</p>
                </div>
                <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary transition-all shrink-0">
                    <span class="material-symbols-outlined text-sm">north_east</span>
                </div>
            </div>
        </a>
    `).join('') + `
        <div class="pt-12 text-center">
            <a href="https://rgcb.res.in/documents/publication/Rakesh_Laishram_Publication_list.pdf" target="_blank" class="inline-flex items-center gap-3 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-primary hover:text-black transition-all font-bold text-lg group">
                See Full Publication List
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
            </a>
        </div>
    `;
}

function selectFacility(id) {
    State.selectedFacility = id;
    State.selectedSubOption = null;
    renderFacilitySelector();
    updateTimes();
}

function selectSubOption(opt) {
    State.selectedSubOption = opt;
    renderFacilitySelector();
    updateTimes();
}

function renderFacilitySelector() {
    const container = document.getElementById('facility-selector');
    if (!container) return;
    
    container.innerHTML = labData.facilities.map(f => `
        <button onclick="selectFacility('${f.id}')" class="facility-tab-circular ${State.selectedFacility === f.id ? 'active' : ''}">
            <span class="material-symbols-outlined text-3xl icon">${f.icon}</span>
            <span class="text-[9px] font-bold uppercase tracking-widest label">${f.name}</span>
        </button>
    `).join('');

    const sub = document.getElementById('facility-sub-options');
    const activeFac = labData.facilities.find(f => f.id === State.selectedFacility);
    if (activeFac && activeFac.options) {
        sub.classList.remove('hidden');
        sub.innerHTML = `
            <div class="flex gap-4 mt-4 justify-center">
                ${activeFac.options.map(opt => `
                    <button onclick="selectSubOption('${opt}')" class="px-6 py-2 rounded-full border text-[10px] font-bold transition-all ${State.selectedSubOption === opt ? 'bg-primary text-black border-primary shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    } else {
        sub.classList.add('hidden');
    }
}

// --- CALENDAR & BOOKING ---
function renderCalendar() {
    const grid = document.getElementById('calendar-view');
    const label = document.getElementById('month-label');
    if (!grid) return;
    grid.innerHTML = '';
    const year = State.currentMonth.getFullYear();
    const month = State.currentMonth.getMonth();
    label.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(State.currentMonth);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => grid.innerHTML += `<div class="text-[11px] font-bold text-white/20 pb-4 uppercase tracking-widest">${d}</div>`);
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isSelected = State.selectedDate === dateStr;
        const dayBookings = State.bookings.filter(b => b.date === dateStr);
        const hasMyBooking = dayBookings.some(b => b.user === State.user?.username);
        
        grid.innerHTML += `
            <button onclick="selectDate('${dateStr}')" class="calendar-day-minimal ${isSelected ? 'selected' : ''} ${hasMyBooking ? 'has-mine' : ''}">
                ${i}
                ${dayBookings.length > 0 ? `<div class="dot-indicator"></div>` : ''}
            </button>
        `;
    }
}

function selectDate(date) {
    State.selectedDate = date;
    document.getElementById('day-detail-container').classList.remove('hidden');
    document.getElementById('detail-date-label').innerText = new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    renderCalendar();
    renderDayTimeline();
    renderFacilitySelector();
}

function renderDayTimeline() {
    const list = document.getElementById('day-timeline');
    if (!list) return;
    const dayBookings = State.bookings.filter(b => b.date === State.selectedDate);
    list.innerHTML = '';
    for (let h = 8; h <= 20; h++) {
        list.innerHTML += `
            <div class="flex gap-10 items-center min-h-[5rem] group">
                <div class="w-14 text-right text-[11px] font-bold text-white/10 group-hover:text-white/30 transition-all">${h}:00</div>
                <div class="flex-1 h-[1px] bg-white/5 relative">
                    ${dayBookings.map(b => {
                        if (Math.floor(b.start / 60) === h) {
                            const topOffset = (b.start % 60) * (5 / 60); 
                            const height = (parseFloat(b.duration) * 5);
                            return `<div class="absolute inset-x-0 rounded-2xl calendar-event-vertical z-10 p-5" style="top: ${topOffset}rem; height: ${height}rem"><p class="text-[11px] font-bold text-white truncate flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span> ${b.facility_name}</p><p class="text-[10px] text-white/40 mt-1">${b.startStr} - ${b.endStr}</p></div>`;
                        }
                        return '';
                    }).join('')}
                </div>
            </div>
        `;
    }
}

function updateTimes() {
    const startPick = document.getElementById('start-time-pick');
    const endPick = document.getElementById('end-time-pick');
    if (!startPick || !endPick) return;
    const startStr = startPick.value;
    const endStr = endPick.value;
    if (!startStr || !endStr) return;
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    State.selectedStart = startTotal;
    State.selectedEnd = endTotal;
    const summary = document.getElementById('booking-summary');
    const text = document.getElementById('summary-text');
    const btn = document.getElementById('confirm-booking-btn');

    const activeFac = labData.facilities.find(f => f.id === State.selectedFacility);
    if (activeFac.options && !State.selectedSubOption) {
        summary.classList.remove('hidden');
        text.innerHTML = `<span class="text-primary">Select Equipment Sub-type</span>`;
        btn.disabled = true;
        return;
    }

    if (endTotal <= startTotal) {
        summary.classList.remove('hidden');
        text.innerHTML = `<span class="text-red-500">Invalid Time Range</span>`;
        btn.disabled = true;
        return;
    }

    const durationMin = endTotal - startTotal;
    const durationH = (durationMin / 60).toFixed(1);
    const isConflict = State.bookings.some(b => {
        if (b.date !== State.selectedDate || b.facility_id !== State.selectedFacility) return false;
        return (startTotal < b.end && endTotal > b.start);
    });

    summary.classList.remove('hidden');
    if (isConflict) {
        text.innerHTML = `<span class="text-red-500 text-lg">Overlap Detected</span>`;
        btn.disabled = true;
    } else {
        const facName = activeFac.name + (State.selectedSubOption ? ` (${State.selectedSubOption})` : "");
        text.innerText = `${facName}: ${startStr} - ${endStr}`;
        btn.disabled = !State.user;
    }
}

function finalizeBooking() {
    if (!State.user) return toggleLoginModal();
    const startStr = document.getElementById('start-time-pick').value;
    const endStr = document.getElementById('end-time-pick').value;
    const durationH = ((State.selectedEnd - State.selectedStart) / 60).toFixed(1);
    const activeFac = labData.facilities.find(f => f.id === State.selectedFacility);
    const facName = activeFac.name + (State.selectedSubOption ? ` (${State.selectedSubOption})` : "");

    const booking = { 
        date: State.selectedDate, 
        start: State.selectedStart, 
        end: State.selectedEnd,
        startStr: startStr,
        endStr: endStr,
        duration: durationH,
        user: State.user.username,
        facility_id: State.selectedFacility,
        facility_name: facName
    };

    State.bookings.push(booking);
    localStorage.setItem('petriplan_v7_bookings', JSON.stringify(State.bookings));
    
    const btn = document.getElementById('confirm-booking-btn');
    btn.innerText = "Confirmed!";
    btn.classList.replace('bg-primary', 'bg-green-500');
    
    // AUTOMATIC UPDATE
    renderCalendar();
    renderDayTimeline();

    setTimeout(() => {
        btn.innerText = "Confirm Session";
        btn.classList.replace('bg-green-500', 'bg-primary');
    }, 800);
}

function renderTeam() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;
    grid.innerHTML = labData.team.map(m => `
        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group">
            <div class="flex items-center gap-5 mb-6">
                <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-black transition-all">
                    ${m.name.charAt(0)}
                </div>
                <div class="text-left">
                    <h4 class="font-headline text-lg font-bold text-white leading-tight">${m.name}</h4>
                    <p class="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">${m.role}</p>
                </div>
            </div>
            <p class="text-sm text-white/40 leading-relaxed font-light">${m.focus}</p>
        </div>
    `).join('');
}
