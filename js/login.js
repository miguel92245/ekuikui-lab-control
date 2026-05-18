// login.js - versão corrigida

const USERS = {
    'secretaria@ekuikui': { password: 'admin', type: 'secretaria', dashboard: 'secretaria.html', nome: 'Secretaria' },
    'michael@2026': { password: '123456', type: 'professor', dashboard: 'professor.html', nome: 'Michael Ferreira' }
};

function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#dc2626' : '#1a1a2e';
    toast.style.color = 'white';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    if (!email || !password) {
        showToast('Preencha email e senha!', 'error');
        return;
    }
    
    const user = USERS[email];
    
    if (user && user.password === password) {
        showToast(`Bem-vindo, ${user.nome}! Redirecionando...`, 'success');
        
        const sessionData = { 
            id: email, 
            nome: user.nome, 
            email: email, 
            tipo: user.type 
        };
        
        localStorage.setItem('labUser', JSON.stringify(sessionData));
        
        setTimeout(() => {
            window.location.href = user.dashboard;
        }, 1000);
    } else {
        showToast('Credenciais inválidas!', 'error');
        document.getElementById('loginError').innerText = 'Email ou senha incorretos';
    }
});

// Preencher email se houver saved (apenas para teste)
window.addEventListener('load', () => {
    const saved = localStorage.getItem('labUser');
    if (saved) {
        try {
            const userData = JSON.parse(saved);
            document.getElementById('email').value = userData.email;
            document.getElementById('remember').checked = true;
        } catch(e) {}
    }
});