const API_URL = 'http://localhost:3000/api';
let currentCarId = null;

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('garage-section').style.display = 'block';
        loadCars();
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('garage-section').style.display = 'none';
        document.getElementById('parts-section').style.display = 'none'; 
        document.getElementById('edit-car-section').style.display = 'none'; 
    }
}

async function register() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });
    
    const data = await res.json();
    document.getElementById('auth-message').innerText = data.message || data.error;
}

async function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });
    
    const data = await res.json();
    
    if (data.token) {
        localStorage.setItem('token', data.token);
        document.getElementById('auth-message').innerText = '';
        checkAuth(); 
    } else {
        document.getElementById('auth-message').innerText = data.error;
    }
}

function logout() {
    localStorage.removeItem('token'); 
    checkAuth(); 
}

async function loadCars() {
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_URL}/cars`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
        logout();
        return;
    }

    const cars = await res.json();
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';

    cars.forEach(car => {
        const li = document.createElement('li');
        li.className = 'car-item';
        li.innerHTML = `
            <div class="car-info">
                ${car.brand} ${car.model} <span>(${car.year})</span>
            </div>
            <div class="btn-group" style="flex: none; gap: 8px;">
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="showParts(${car.id}, '${car.brand} ${car.model}')">Parts</button>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; border-color: var(--neon-blue); color: var(--neon-blue);" onclick="openEditCar(${car.id}, '${car.brand}', '${car.model}', ${car.year})">Edit</button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 0.85rem;" onclick="deleteCar(${car.id})">Delete</button>
            </div>
        `;
        carList.appendChild(li);
    });
}

async function addCar() {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const token = localStorage.getItem('token');

    if (!brand || !model || !year) {
        alert('Please fill in all fields.');
        return;
    }

    const res = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ brand, model, year })
    });

    if (res.ok) {
        document.getElementById('brand').value = '';
        document.getElementById('model').value = '';
        document.getElementById('year').value = '';
        loadCars(); 
    } else {
        const data = await res.json();
        alert(data.error || 'Failed to add vehicle.');
    }
}

function openEditCar(id, brand, model, year) {
    document.getElementById('edit-car-id').value = id;
    document.getElementById('edit-brand').value = brand;
    document.getElementById('edit-model').value = model;
    document.getElementById('edit-year').value = year;
    document.getElementById('edit-car-section').style.display = 'block';
}

function closeEditCar() {
    document.getElementById('edit-car-section').style.display = 'none';
}

async function submitEditCar() {
    const id = document.getElementById('edit-car-id').value;
    const brand = document.getElementById('edit-brand').value;
    const model = document.getElementById('edit-model').value;
    const year = document.getElementById('edit-year').value;
    const token = localStorage.getItem('token');

    if (!brand || !model || !year) {
        alert('Please fill in all fields.');
        return;
    }

    const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ brand, model, year })
    });

    if (res.ok) {
        closeEditCar();
        loadCars(); 
    } else {
        const data = await res.json();
        alert(data.error || 'Failed to update vehicle.');
    }
}

async function deleteCar(carId) {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/cars/${carId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
        if (currentCarId === carId) {
            closeParts();
        }
        loadCars();
    } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete vehicle.');
    }
}

async function showParts(carId, carName) {
    currentCarId = carId;
    const token = localStorage.getItem('token');
    
    document.getElementById('selected-car-title').innerText = `Modifications for ${carName}`;
    document.getElementById('parts-section').style.display = 'block';
    
    document.getElementById('add-part-btn').onclick = () => addPart(carId, carName);

    const res = await fetch(`${API_URL}/parts/${carId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const parts = await res.json();
    const partList = document.getElementById('part-list');
    partList.innerHTML = '';

    if (parts.error) {
        partList.innerHTML = `<li class="car-item" style="color: var(--neon-red);">${parts.error}</li>`;
        return;
    }

    if (parts.length === 0) {
        partList.innerHTML = `<li class="car-item" style="color: var(--text-muted);">No modifications installed yet.</li>`;
        return;
    }

    parts.forEach(part => {
        const li = document.createElement('li');
        li.className = 'car-item';
        li.style.borderColor = 'var(--border-color)';
        li.innerHTML = `
            <div class="car-info">
                🛠️ ${part.part_name} <span>Cost: $${part.cost}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">
                ${part.installed_date || ''}
            </div>
        `;
        partList.appendChild(li);
    });
}

async function addPart(carId, carName) {
    const part_name = document.getElementById('part-name').value;
    const cost = document.getElementById('part-cost').value;
    const installed_date = document.getElementById('part-date').value;
    const token = localStorage.getItem('token');

    if (!part_name || !cost) {
        alert('Please enter part name and cost.');
        return;
    }

    const res = await fetch(`${API_URL}/parts`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ car_id: carId, part_name, cost, installed_date })
    });

    if (res.ok) {
        document.getElementById('part-name').value = '';
        document.getElementById('part-cost').value = '';
        document.getElementById('part-date').value = '';
        showParts(carId, carName);
    } else {
        const data = await res.json();
        alert(data.error || 'Failed to add part.');
    }
}

function closeParts() {
    document.getElementById('parts-section').style.display = 'none';
    currentCarId = null;
}