
if (!localStorage.getItem('penzgtu_users')) {
  const demoUser = {
    login: 'student',
    password: '123456',
    fullName: 'Студент ПензГТУ',
    email: 'student@penzgtu.ru',
    avatar: '👤'
  };
  localStorage.setItem('penzgtu_users', JSON.stringify([demoUser]));
}


window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader').style.display = 'none';
    }, 500);
  }, 300);
});


const snowContainer = document.getElementById('snowflakes');
const flakes = '❄️❅❆⭐';
for (let i = 0; i < 50; i++) {
  const snow = document.createElement('div');
  snow.className = 'snowflake';
  snow.textContent = flakes.charAt(Math.floor(Math.random() * flakes.length));
  snow.style.left = Math.random() * 100 + 'vw';
  snow.style.opacity = Math.random() * 0.7 + 0.3;
  snow.style.fontSize = (Math.random() * 20 + 16) + 'px';
  snow.style.animationDuration = (Math.random() * 5 + 5) + 's';
  snow.style.animationDelay = Math.random() * 5 + 's';
  snowContainer.appendChild(snow);
}


function showMainContent() {
  document.getElementById('introScreen').style.display = 'none';
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('header').classList.add('show');
  document.getElementById('mainContainer').classList.add('show');
  document.getElementById('footer').classList.add('show');
  document.getElementById('logoutBtn').style.display = 'block';
  loadHomePage();
}


function getCurrentUser() {
  return JSON.parse(localStorage.getItem('penzgtu_current_user'));
}

function saveCurrentUser(user) {
  localStorage.setItem('penzgtu_current_user', JSON.stringify(user));
}


function generateCalendar(month = null, year = null) {
  const now = new Date();
  const m = month !== null ? month : now.getMonth();
  const y = year !== null ? year : now.getFullYear();

  const firstDay = new Date(y, m, 1).getDay() || 7; // Пн = 1
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const monthNames = ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];

  let html = `<div class="calendar-header">
    <button class="calendar-btn" id="prevMonth">←</button>
    <h3>${monthNames[m]} ${y}</h3>
    <button class="calendar-btn" id="nextMonth">→</button>
  </div>
  <table class="calendar-table">
    <thead><tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr></thead>
    <tbody><tr>`;

  
  for (let i = 1; i < firstDay; i++) {
    html += '<td></td>';
  }

  
  let day = 1;
  for (let i = firstDay; i <= 7; i++, day++) {
    html += `<td>${day}</td>`;
  }
  while (day <= daysInMonth) {
    html += '<tr>';
    for (let i = 0; i < 7 && day <= daysInMonth; i++, day++) {
      html += `<td>${day}</td>`;
    }
    
    while (i < 7) {
      html += '<td></td>';
      i++;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';

  const container = document.querySelector('.main-content');
  container.innerHTML = `<h2 class="section-title">Личный кабинет</h2>${html}`;

 
  document.getElementById('prevMonth').onclick = () => {
    const prev = m === 0 ? 11 : m - 1;
    const prevYear = m === 0 ? y - 1 : y;
    generateCalendar(prev, prevYear);
  };
  document.getElementById('nextMonth').onclick = () => {
    const next = m === 11 ? 0 : m + 1;
    const nextYear = m === 11 ? y + 1 : y;
    generateCalendar(next, nextYear);
  };
}


function setActiveMenu(id) {
  document.querySelectorAll('.menu-list a').forEach(el => el.classList.remove('active'));
  if (id) document.getElementById(id).classList.add('active');
}

function loadHomePage() {
  setActiveMenu('homeLink');
  document.querySelector('.main-content').innerHTML = `
    <h2 class="section-title">Новости сайта</h2>
    <div class="news-card">
      <div class="news-header">
        <div class="avatar">ПС</div>
        <div>
          <div class="news-title">Укажите свой действующий e-mail!</div>
          <div class="news-meta">от Печерский Сергей Викторович - среда, 5 марта 2025, 12:06</div>
        </div>
      </div>
      <div class="news-body">
        Уважаемые студенты! Свои забытые пароли вы можете восстановить самостоятельно...
      </div>
      <div class="news-footer">
        <a href="#" class="btn-link">Постоянная ссылка</a>
        <a href="#" class="discuss-link">Обсудить эту тему (Пока 0 ответов)</a>
      </div>
    </div>
  `;
}

function loadPersonalCabinet() {
  const user = getCurrentUser();
  if (!user) return;

  setActiveMenu('cabinetLink');
  document.querySelector('.main-content').innerHTML = `
    <h2 class="section-title">Личный кабинет</h2>
    <div class="profile-card">
      <div class="profile-avatar">${user.avatar || '👤'}</div>
      <div class="profile-info">
        <div><strong>ФИО:</strong> <span id="fullNameDisplay">${user.fullName}</span></div>
        <div><strong>Email:</strong> <span id="emailDisplay">${user.email}</span></div>
        <div><strong>Логин:</strong> ${user.login}</div>
        <button id="editProfileBtn" class="btn-auth" style="margin-top: 1rem;">Редактировать профиль</button>
      </div>
    </div>
    <div class="calendar-container" style="margin-top: 2rem;">
      <!-- Календарь будет здесь -->
    </div>
  `;

  
  document.getElementById('editProfileBtn').addEventListener('click', () => {
    const newFullName = prompt('Введите новое ФИО:', user.fullName);
    const newEmail = prompt('Введите новый email:', user.email);
    if (newFullName !== null && newEmail !== null) {
      user.fullName = newFullName.trim() || user.fullName;
      user.email = newEmail.trim() || user.email;
      saveCurrentUser(user);

     
      const users = JSON.parse(localStorage.getItem('penzgtu_users'));
      const index = users.findIndex(u => u.login === user.login);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem('penzgtu_users', JSON.stringify(users));
      }

      loadPersonalCabinet(); 
    }
  });

  
  generateCalendar();
}


document.getElementById('homeLink').addEventListener('click', (e) => {
  e.preventDefault();
  loadHomePage();
});
document.getElementById('cabinetLink').addEventListener('click', (e) => {
  e.preventDefault();
  loadPersonalCabinet();
});


document.getElementById('startButton').addEventListener('click', () => {
  document.getElementById('introScreen').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('introScreen').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
  }, 800);
});

document.getElementById('switchToRegister').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('authTitle').textContent = 'Регистрация';
  document.getElementById('switchToRegister').parentElement.style.display = 'none';
  document.getElementById('switchToLogin').style.display = 'block';
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('authTitle').textContent = 'Вход в систему';
  document.getElementById('switchToRegister').parentElement.style.display = 'block';
  document.getElementById('switchToLogin').style.display = 'none';
  document.getElementById('passwordInput').value = '';
});

document.getElementById('authForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const login = document.getElementById('loginInput').value.trim();
  const pass = document.getElementById('passwordInput').value;
  const isReg = document.getElementById('authTitle').textContent === 'Регистрация';
  const users = JSON.parse(localStorage.getItem('penzgtu_users'));

  if (isReg) {
    if (users.some(u => u.login === login)) {
      alert('Логин уже занят!');
      return;
    }
    const newUser = {
      login,
      password: pass,
      fullName: login,
      email: `${login}@penzgtu.ru`,
      avatar: '👤'
    };
    users.push(newUser);
    localStorage.setItem('penzgtu_users', JSON.stringify(users));
    alert('Регистрация успешна! Теперь войдите.');
    document.getElementById('authTitle').textContent = 'Вход в систему';
    document.getElementById('switchToRegister').parentElement.style.display = 'block';
    document.getElementById('switchToLogin').style.display = 'none';
    document.getElementById('passwordInput').value = '';
  } else {
    const user = users.find(u => u.login === login && u.password === pass);
    if (user) {
      localStorage.setItem('penzgtu_current_user', JSON.stringify(user));
      showMainContent();
    } else {
      alert('Неверный логин или пароль!');
    }
  }
});


document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('penzgtu_current_user');
  location.reload();
});


document.getElementById('header').classList.remove('show');
document.getElementById('mainContainer').classList.remove('show');
document.getElementById('footer').classList.remove('show');
document.getElementById('logoutBtn').style.display = 'none';

