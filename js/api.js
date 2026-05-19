// api.js - Configuração central da API

const API_URL = 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado ou inválido
                localStorage.removeItem('labUser');
                localStorage.removeItem('token');
                sessionStorage.removeItem('labUser');
                sessionStorage.removeItem('token');
                window.location.href = 'index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            throw new Error(data.message || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}