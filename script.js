// Utility to show only the selected section
function showSection(sectionId) {
    const sections = [
        'auth-section',
        'profile-section',
        'materials-section',
        'threads-section'
    ];
    sections.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// --- Auth UI switching ---
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
document.getElementById('show-signin').onclick = function() {
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
    return false;
};
document.getElementById('show-signup').onclick = function() {
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    return false;
};

// --- LocalStorage helpers ---
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}
function logout() {
    localStorage.removeItem('currentUser');
    showSection('auth-section');
}

// --- Sign Up ---
document.getElementById('form-signup').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    let users = getUsers();
    if (users.find(u => u.email === email)) {
        alert('Email already registered.');
        return;
    }
    const user = { name, email, password, bio: '' };
    users.push(user);
    setUsers(users);
    setCurrentUser(user);
    document.getElementById('form-signup').reset();
    showProfile();
};

// --- Sign In ---
document.getElementById('form-signin').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    let users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('Invalid credentials.');
        return;
    }
    setCurrentUser(user);
    document.getElementById('form-signin').reset();
    showProfile();
};

// --- Profile ---
function showProfile() {
    const user = getCurrentUser();
    if (!user) {
        showSection('auth-section');
        return;
    }
    document.getElementById('profile-name').value = user.name;
    document.getElementById('profile-bio').value = user.bio || '';
    showSection('profile-section');
}
document.getElementById('profile-form').onsubmit = function(e) {
    e.preventDefault();
    let user = getCurrentUser();
    user.name = document.getElementById('profile-name').value.trim();
    user.bio = document.getElementById('profile-bio').value;
    setCurrentUser(user);
    // Update in users list
    let users = getUsers();
    users = users.map(u => u.email === user.email ? user : u);
    setUsers(users);
    alert('Profile updated!');
};
document.getElementById('logout-btn').onclick = logout;

// --- Materials ---
function getMaterials() {
    return JSON.parse(localStorage.getItem('materials') || '[]');
}
function setMaterials(materials) {
    localStorage.setItem('materials', JSON.stringify(materials));
}
function renderMaterials(filter = '') {
    const list = document.getElementById('materials-list');
    let materials = getMaterials();
    if (filter) {
        materials = materials.filter(m => m.title.toLowerCase().includes(filter.toLowerCase()) || m.content.toLowerCase().includes(filter.toLowerCase()));
    }
    list.innerHTML = '';
    materials.forEach(m => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${m.title}</strong> <br>${m.content}<br><em>by ${m.authorName}</em>${m.tags ? `<br><small>Tags: ${m.tags.join(', ')}</small>` : ''}`;
        list.appendChild(li);
    });
}
document.getElementById('material-form').onsubmit = function(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    const title = document.getElementById('material-title').value.trim();
    const content = document.getElementById('material-content').value.trim();
    const tags = document.getElementById('material-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    let materials = getMaterials();
    materials.unshift({ title, content, tags, author: user.email, authorName: user.name });
    setMaterials(materials);
    document.getElementById('material-form').reset();
    renderMaterials();
};
document.getElementById('search-materials').oninput = function(e) {
    renderMaterials(e.target.value);
};

// --- Threads ---
function getThreads() {
    return JSON.parse(localStorage.getItem('threads') || '[]');
}
function setThreads(threads) {
    localStorage.setItem('threads', JSON.stringify(threads));
}
function renderThreads() {
    const list = document.getElementById('threads-list');
    let threads = getThreads();
    list.innerHTML = '';
    threads.forEach((t, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${t.title}</strong><br>${t.content}<br><em>by ${t.authorName}</em><br>`;
        // Replies
        if (t.replies && t.replies.length) {
            li.innerHTML += '<ul>' + t.replies.map(r => `<li>${r.content} <br><em>by ${r.authorName}</em></li>`).join('') + '</ul>';
        }
        // Reply form
        const replyForm = document.createElement('form');
        replyForm.innerHTML = `<input type="text" placeholder="Reply..." required><button type="submit">Reply</button>`;
        replyForm.onsubmit = function(e) {
            e.preventDefault();
            const user = getCurrentUser();
            if (!user) return;
            const replyContent = replyForm.querySelector('input').value.trim();
            if (!replyContent) return;
            t.replies = t.replies || [];
            t.replies.push({ content: replyContent, author: user.email, authorName: user.name });
            let threads = getThreads();
            threads[idx] = t;
            setThreads(threads);
            renderThreads();
        };
        li.appendChild(replyForm);
        list.appendChild(li);
    });
}
document.getElementById('thread-form').onsubmit = function(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    const title = document.getElementById('thread-title').value.trim();
    const content = document.getElementById('thread-content').value.trim();
    let threads = getThreads();
    threads.unshift({ title, content, author: user.email, authorName: user.name, replies: [] });
    setThreads(threads);
    document.getElementById('thread-form').reset();
    renderThreads();
};

// --- Navigation override to check auth ---
window.onload = function() {
    document.querySelector('a[href="#profile"]').onclick = function() {
        if (!getCurrentUser()) { showSection('auth-section'); return false; }
        showProfile();
        return false;
    };
    document.querySelector('a[href="#materials"]').onclick = function() {
        if (!getCurrentUser()) { showSection('auth-section'); return false; }
        showSection('materials-section');
        renderMaterials();
        return false;
    };
    document.querySelector('a[href="#threads"]').onclick = function() {
        if (!getCurrentUser()) { showSection('auth-section'); return false; }
        showSection('threads-section');
        renderThreads();
        return false;
    };
    document.getElementById('auth-link').onclick = function() {
        showSection('auth-section');
        return false;
    };
    // Show profile if logged in, else auth
    if (getCurrentUser()) {
        showProfile();
    } else {
        showSection('auth-section');
    }
}; 