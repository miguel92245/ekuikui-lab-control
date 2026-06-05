// login.js - usando API

function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#dc2626' : '#1a1a2e';
    toast.style.color = 'white';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    if (!email || !password) {
        showToast('Preencha email e senha!', 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha: password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showToast(data.message || 'Credenciais inválidas!', 'error');
            return;
        }
        
        showToast(`Bem-vindo, ${data.user.nome}! Redirecionando...`, 'success');
        
        if (remember) {
            localStorage.setItem('labUser', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
        } else {
            sessionStorage.setItem('labUser', JSON.stringify(data.user));
            sessionStorage.setItem('token', data.token);
        }
        
        setTimeout(() => {
            if (data.user.tipo === 'secretaria') {
                window.location.href = 'secretaria.html';
            } else {
                window.location.href = 'professor.html';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Erro no login:', error);
        showToast('Erro ao conectar com o servidor', 'error');
    }
});

// Preencher email se houver dados guardados
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