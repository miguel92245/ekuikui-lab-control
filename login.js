const USERS = {
    'admin@ekuikui': { password: '1234', dashboard: 'dashboard.html' }
};

document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !password){
        showToast("Preencha todos os campos");
        return;
    }

    const user = USERS[email];

    if(user && user.password === password){
        showToast("Login sucesso");
        setTimeout(()=>{
            window.location.href = user.dashboard;
        },1000);
    }else{
        showToast("Erro no login");
    }
});

function showToast(msg){
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(()=>{
        toast.classList.remove('show');
    },3000);
}