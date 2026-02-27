const container = document.querySelector('.container');
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn'); // For toggle on login page

// Register Buttons (Toggle between User/Owner on register page)
const userRegisterBtn = document.getElementById('user-register-btn');
const ownerRegisterBtn = document.getElementById('owner-register-btn');

// Form Containers
const userFormContainer = document.getElementById('user-form-container');
const ownerFormContainer = document.getElementById('owner-form-container');

// Toggle between Login and Register panels (if elements exist)
/* 
if (registerBtn && container) {
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });
}
*/

if (loginBtn && container) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });
}

// Toggle between User and Owner forms (Registration Page)
if (userRegisterBtn && ownerRegisterBtn) {
    userRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (container) container.classList.add('active');
        userFormContainer.style.display = 'block';
        ownerFormContainer.style.display = 'none';
        userRegisterBtn.style.border = '2px solid #fff';
        ownerRegisterBtn.style.border = 'none';
    });

    ownerRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (container) container.classList.add('active');
        userFormContainer.style.display = 'none';
        ownerFormContainer.style.display = 'block';
        ownerRegisterBtn.style.border = '2px solid #fff';
        userRegisterBtn.style.border = 'none';
    });
}

// ---------------------------------------------------------
// Login Form Handling
// ---------------------------------------------------------
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const email = inputs[0].value; // Assuming first input is username/email
        const password = inputs[1].value;

        try {
            // Using login function from data.js
            const response = await login(email, password);

            if (response.success) {
                // Store user in localStorage (include token so api-config.js can send it)
                const userToStore = {
                    ...response.user,
                    token: response.token  // CRITICAL: token must be inside the user object
                };
                localStorage.setItem('yatraNowUser', JSON.stringify(userToStore));
                if (response.token) {
                    localStorage.setItem('yatraNowToken', response.token);
                }

                showToast(`Welcome back, ${response.user.name}!`, 'success');

                // Wait 4 seconds so the user can see the toast before redirecting
                setTimeout(() => {
                    const role = response.user.role.toUpperCase();
                    if (role === 'OWNER' || role === 'ROLE_OWNER') {
                        window.location.href = 'owner.html';
                    } else if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'user.html';
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message || 'Login failed. Please check your credentials.', 'error');
        }
    });
}

// ---------------------------------------------------------
// User Registration Handling
// ---------------------------------------------------------
if (userFormContainer) {
    const userForm = userFormContainer.querySelector('form');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = userForm.querySelectorAll('input');

            const userData = {
                name: inputs[0].value,
                email: inputs[1].value,
                phone: inputs[2].value,
                password: inputs[3].value,
                role: 'USER'
            };

            try {
                const response = await registerUser(userData);
                if (response.success) {
                    showToast('Registration successful! Please login.', 'success');
                    // Wait 4 seconds so the user can see the toast before switching view
                    setTimeout(() => {
                        if (container) {
                            container.classList.remove('active');
                        } else {
                            window.location.href = 'login.html';
                        }
                    }, 2000);
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToast(error.message || 'Registration failed.', 'error');
            }
        });
    }
}

// ---------------------------------------------------------
// Owner Registration Handling
// ---------------------------------------------------------
if (ownerFormContainer) {
    const ownerForm = ownerFormContainer.querySelector('form');
    if (ownerForm) {
        ownerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = ownerForm.querySelectorAll('input');

            // inputs: 0=Name, 1=Agency, 2=Email, 3=Phone, 4=File, 5=Password
            const ownerData = {
                ownerName: inputs[0].value,
                agencyName: inputs[1].value,
                email: inputs[2].value,
                phone: inputs[3].value,
                password: inputs[5].value, // Password is last text input
                role: 'OWNER'
            };

            const imageFile = inputs[4].files[0];

            try {
                const response = await registerOwner(ownerData, imageFile);
                if (response.success) {
                    showToast('Owner registration successful! Please login.', 'success');
                    // Wait 4 seconds so the user can see the toast before switching view
                    setTimeout(() => {
                        if (container) {
                            container.classList.remove('active');
                        } else {
                            window.location.href = 'login.html';
                        }
                    }, 2000);
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToast(error.message || 'Registration failed.', 'error');
            }
        });
    }
}
