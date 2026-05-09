import './style.css';

/**
 * --- SUPABASE CONFIGURATION ---
 * Official credentials for PetriPlan Division Portal
 */
const SUPABASE_URL = "https://xhiqltrsxrejldfuvfgr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaXFsdHJzeHJlamxkZnV2ZmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzIxMDEsImV4cCI6MjA5MzgwODEwMX0.OeqHj63tmSF9iebL8UEYIr8VufMZ17rVXoA5WYJsM-g";
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

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
            title: "Cleavage site heterogeneity at the pre-mRNA 3′-untranslated region regulates gene expression in oxidative stress response",
            authors: "Feba Shaji, Jamshaid Ali, Rakesh S. Laishram",
            journal: "Redox Biology (2025)",
            url: "https://doi.org/10.1016/j.redox.2025.103565"
        },
        {
            title: "Star-PAP controls oncogene expression through primary miRNA 3'-end formation to regulate cellular proliferation and tumour formation",
            authors: "Mohanan, N. K., Shaji, F., Sudheesh, A. P., Arathi, B. P., Sundaresan, N. R., & Laishram R. S. (2024)",
            journal: "Biochimica et biophysica acta. Molecular basis of disease (2024)",
            url: "https://doi.org/10.1016/j.bbadis.2024.167080"
        },
        {
            title: "Proto-oncogene cSrc-mediated RBM10 phosphorylation arbitrates anti-hypertrophy gene program in the heart and controls cardiac hypertrophy",
            authors: "Feba Shaji, Neeraja K Mohanan, Sumayya Shahzad, Gowri V P, Arathi Bangalore Prabhashankar, Nagalingam R Sundaresan, Rakesh S Laishram",
            journal: "Life Sciences (2024)",
            url: "https://doi.org/10.1016/j.lfs.2024.122482"
        },
        {
            title: "Tyrosine phosphorylation controlled poly(A) polymerase I activity regulates general stress response in bacteria",
            authors: "Nimmy Francis, Malaya R Behera, Kathiresan Natarajan, Rakesh S Laishram",
            journal: "Life Science Alliance (2022)",
            url: "https://doi.org/10.26508/lsa.202101148"
        },
        {
            title: "Star-PAP RNA Binding Landscape Reveals Novel Role of Star-PAP in mRNA Metabolism That Requires RBM10-RNA Association",
            authors: "Ganesh R. Koshre, Feba Shaji, Neeraja K. Mohanan, Nimmy Mohan, Jamshaid Ali and Rakesh S. Laishram",
            journal: "International Journal of Molecular Sciences (2021)",
            url: "https://doi.org/10.3390/ijms22189980"
        },
        {
            title: "Transgenesis of mammalian PABP reveals mRNA polyadenylation as a general stress response mechanism in bacteria",
            authors: "Francis N., Laishram R. S.",
            journal: "iScience (2021)",
            url: "https://doi.org/10.1016/j.isci.2021.103119"
        },
        {
            title: "Alternative polyadenylation: An enigma of transcript length variation in health and disease",
            authors: "Neeraja K Mohanan, Feba Shaji, Ganesh R Koshre, Rakesh S Laishram",
            journal: "Wiley Interdiscip Rev RNA (2021)",
            url: "https://doi.org/10.1002/wrna.1692"
        },
        {
            title: "Star-PAP controlled alternative polyadenylation coupled poly(A) tail length regulates expression in hypertrophic heart",
            authors: "Sudheesh, A.P., Mohan, N., Nimmy, F., Rakesh S. Laishram*, and Richard Anderson*",
            journal: "Nucleic Acid Res. (2019)",
            url: "https://doi.org/10.1093/nar/gkz875"
        },
        {
            title: "A splicing-independent function of RBM10 controls specific 3'UTR processing to regulate cardiac hypertrophy",
            authors: "Mohan, N., Kumar, V., Kandala, D., Kartha, C.C., and Rakesh S. Laishram",
            journal: "Cell Reports (2018)",
            url: "https://doi.org/10.1016/j.celrep.2018.08.077"
        }
    ],
    facilities: [
        { id: "cell", name: "Cell Culture", icon: "biotech", color: "#ffb4ac" },
        { id: "bacterial", name: "Bacterial Culture", icon: "science", color: "#4ade80" },
        { id: "pcr", name: "PCR", icon: "settings_suggest", color: "#60a5fa" },
        { id: "qrtpcr", name: "qRT-PCR", icon: "settings_suggest", color: "#c084fc" }
    ]
};

// --- SECURE STATE ---
const State = {
    user: null,
    bookings: JSON.parse(localStorage.getItem('petriplan_v6_bookings') || '[]'),
    currentMonth: new Date(),
    selectedDate: null,
    selectedStart: null,
    selectedEnd: null,
    selectedFacility: null,
    isAdmin: false
};

// --- INIT ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function initApp() {
    // Attach to window immediately so HTML handlers work even if Supabase is slow
    window.navigateTo = navigateTo;
    window.scrollToSection = scrollToSection;
    window.toggleLoginModal = toggleLoginModal;
    window.handleGoogleLogin = handleGoogleLogin;
    window.handleAuthAction = handleAuthAction;
    window.changeMonth = changeMonth;
    window.selectDate = selectDate;
    window.updateTimes = updateTimes;
    window.finalizeBooking = finalizeBooking;
    window.logout = logout;
    window.selectFacility = selectFacility;
    window.finalizeMockAuth = finalizeMockAuth;
    window.closeGoogleSelector = closeGoogleSelector;

    renderTeam();
    renderPubs();
    renderCalendar();
    renderFacilitySelector();
    updateAuthUI();

    if (supabase) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) syncUser(session.user);

            supabase.auth.onAuthStateChange((_event, session) => {
                if (session) syncUser(session.user);
                else { State.user = null; State.isAdmin = false; updateAuthUI(); }
            });
            fetchBookings();
        } catch (e) {
            console.warn("Supabase auth error:", e);
        }
    }
}

async function fetchBookings() {
    if (!supabase) return;
    try {
        const { data } = await supabase.from('bookings').select('*');
        if (data) {
            State.bookings = data;
            localStorage.setItem('petriplan_v6_bookings', JSON.stringify(State.bookings));
            renderCalendar();
            if (State.selectedDate) renderDayTimeline();
        }
    } catch (e) { console.warn("Supabase fetch failed."); }
}

function syncUser(supabaseUser) {
    if (!supabaseUser) return;
    const email = supabaseUser.email;
    const metadata = supabaseUser.user_metadata || {};

    // STRICT ADMIN CONTROL: Only annmaryjoseph@rgcb.res.in
    const adminEmail = "annmaryjoseph@rgcb.res.in";

    State.user = {
        name: metadata.full_name || email.split('@')[0],
        email: email,
        avatar: metadata.avatar_url || email.charAt(0).toUpperCase(),
        role: email === adminEmail ? 'admin' : 'researcher',
        id: supabaseUser.id
    };
    State.isAdmin = State.user.role === 'admin';
    updateAuthUI();
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    const header = document.getElementById('main-header');
    if (pageId === 'home') {
        header.classList.remove('-translate-y-full');
    } else {
        header.classList.add('-translate-y-full');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleLoginModal() {
    document.getElementById('login-modal').classList.toggle('active');
}

async function handleGoogleLogin() {
    if (!supabase) {
        alert("Supabase not initialized. Using mock auth for development.");
        document.getElementById('google-selector').classList.remove('hidden');
        document.getElementById('google-selector').classList.add('flex');
        return;
    }
    const redirectUrl = window.location.origin + window.location.pathname;
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                prompt: 'select_account'
            }
        }
    });
    if (error) alert(error.message);
}

async function handleAuthAction() {
    const email = document.getElementById('auth-email').value;
    if (!email.includes('@rgcb.res.in')) { document.getElementById('auth-error').classList.remove('hidden'); return; }
    if (supabase) {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectUrl }
        });
        if (error) alert(error.message);
        else alert("Login link sent to " + email + ". Check your inbox!");
    }
}

async function logout() {
    if (supabase) await supabase.auth.signOut();
    State.user = null; State.isAdmin = false; updateAuthUI(); navigateTo('home');
}

function finalizeMockAuth(email, name) {
    const mockUser = {
        id: 'mock-id-' + Math.random(),
        email: email,
        user_metadata: {
            full_name: name,
            avatar_url: null
        }
    };
    syncUser(mockUser);
    closeGoogleSelector();
    toggleLoginModal();
}

function closeGoogleSelector() {
    document.getElementById('google-selector').classList.add('hidden');
    document.getElementById('google-selector').classList.remove('flex');
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
                    <p class="text-[9px] text-primary/50 uppercase tracking-[0.3em]">${State.user.role}</p>
                </div>
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    ${State.user.avatar.length === 1 ? `<div class="w-full h-full bg-primary flex items-center justify-center text-black font-bold">${State.user.avatar}</div>` : `<img src="${State.user.avatar}" class="w-full h-full object-cover"/>`}
                </div>
            </div>
        `;
        if (bookStatus) bookStatus.innerHTML = `<span class="text-primary font-bold">Authenticated:</span> ${State.user.email}`;
        if (bookBtn) {
            bookBtn.disabled = false;
            bookBtn.classList.remove('opacity-20', 'cursor-not-allowed', 'bg-white/10', 'text-white/20');
            bookBtn.classList.add('bg-primary', 'text-black');
        }
        if (State.isAdmin && adminPanel) adminPanel.classList.remove('hidden');
        else if (adminPanel) adminPanel.classList.add('hidden');
    } else {
        authBox.innerHTML = `<button onclick="toggleLoginModal()" class="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10">Signin</button>`;
        if (bookStatus) bookStatus.innerHTML = `Login to continue`;
        if (bookBtn) { bookBtn.disabled = true; bookBtn.classList.add('opacity-20'); }
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

function changeMonth(delta) {
    State.currentMonth.setMonth(State.currentMonth.getMonth() + delta);
    renderCalendar();
}

function selectFacility(id) {
    State.selectedFacility = id;
    renderFacilitySelector();
    updateTimes();
    if (State.selectedDate) {
        renderDayTimeline();
    }
}

function renderFacilitySelector() {
    const container = document.getElementById('facility-selector');
    if (!container) return;

    container.innerHTML = labData.facilities.map(f => `
        <button onclick="selectFacility('${f.id}')" class="flex-1 flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border transition-all ${State.selectedFacility === f.id ? 'border-primary shadow-xl shadow-primary/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}" style="${State.selectedFacility === f.id ? `background-color: ${f.color}20; border-color: ${f.color}` : ''}">
            <span class="material-symbols-outlined text-3xl ${State.selectedFacility === f.id ? '' : 'text-white/20'}" style="${State.selectedFacility === f.id ? `color: ${f.color}` : ''}">${f.icon}</span>
            <span class="text-[11px] font-bold uppercase tracking-widest ${State.selectedFacility === f.id ? 'text-white' : 'text-white/40'}">${f.name}</span>
        </button>
    `).join('');
}

// --- CALENDAR & BOOKING (SAME AS BEFORE BUT WITH FACILITY CONTEXT) ---
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
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => grid.innerHTML += `<div class="text-[11px] font-bold text-white/20 pb-6 uppercase tracking-widest">${d}</div>`);
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isSelected = State.selectedDate === dateStr;
        const dayBookings = State.bookings.filter(b => b.date === dateStr);

        // Group bookings by facility to show dots for each type
        const bookedFacilities = [...new Set(dayBookings.map(b => b.facility_id))];

        grid.innerHTML += `
            <button onclick="selectDate('${dateStr}')" class="aspect-square flex flex-col items-center justify-center rounded-[1.8rem] text-base transition-all ${isSelected ? 'bg-primary text-black font-bold scale-110 shadow-2xl shadow-primary/30' : 'hover:bg-white/5 text-white/40'}">
                ${i}
                <div class="flex gap-1 mt-1">
                    ${bookedFacilities.map(facId => {
                        const fac = labData.facilities.find(f => f.id === facId);
                        return `<div class="w-1.5 h-1.5 rounded-full" style="background-color: ${fac ? fac.color : '#fff'}"></div>`;
                    }).join('')}
                </div>
            </button>`;
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
            <div class="flex gap-6 items-center min-h-[4rem] group">
                <div class="w-16 text-right text-[10px] font-bold text-white/10 group-hover:text-white/30 transition-all">${h}:00</div>
                <div class="flex-1 h-[1px] bg-white/5 relative">
                    ${dayBookings.map(b => {
                        if (Math.floor(b.start / 60) === h) {
                            const topOffset = (b.start % 60) * (4 / 60);
                            const height = (parseFloat(b.duration) * 4);
                            const fac = labData.facilities.find(f => f.id === b.facility_id);
                            const color = fac ? fac.color : '#ffb4ac';
                            return `<div class="absolute inset-x-0 rounded-2xl calendar-event z-10 p-4" style="top: ${topOffset - 1}rem; height: ${height}rem; border-color: ${color}; background: ${color}20"><p class="text-[10px] font-bold text-white truncate">${b.facility_name || 'Reserved'}</p><p class="text-[9px] font-mono" style="color: ${color}">${b.startStr} - ${b.endStr}</p></div>`;
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
    if (!activeFac) {
        summary.classList.remove('hidden');
        text.innerHTML = `<span class="text-primary">Select Booking Type</span>`;
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
        text.innerHTML = `<span class="text-red-500 text-lg">Timeline Overlap Detected for ${activeFac.name}</span>`;
        btn.disabled = true;
    } else {
        const facName = activeFac.name;
        text.innerText = `${facName}: ${startStr} - ${endStr}`;
        btn.disabled = !State.user;
    }
}

async function finalizeBooking() {
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
        user: State.user.email,
        user_id: State.user.id,
        facility_id: State.selectedFacility,
        facility_name: facName
    };

    State.bookings.push(booking);
    if (supabase) {
        const { error } = await supabase.from('bookings').insert([booking]);
        if (error) console.error(error.message);
    }

    const btn = document.getElementById('confirm-booking-btn');
    btn.innerText = "Confirmed!";
    btn.classList.replace('bg-primary', 'bg-green-500');
    setTimeout(() => {
        btn.innerText = "Confirm Session";
        btn.classList.replace('bg-green-500', 'bg-primary');
        renderCalendar(); renderDayTimeline();
    }, 800);
}

// --- TEAM RENDER ---
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
