// Moneer Developer
document.addEventListener('DOMContentLoaded', function() {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountForm = document.getElementById('accountForm');
    const accountsContainer = document.getElementById('accountsContainer');
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const editModal = document.getElementById('editModal');
    const editAccountForm = document.getElementById('editAccountForm');
    const closeModal = document.querySelector('.close-modal');

    displayAccounts(accounts);

    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const accountType = document.getElementById('accountType').value;
        const accountName = document.getElementById('accountName').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const notes = document.getElementById('notes').value.trim();

        const newAccount = {
            id: Date.now().toString(),
            type: accountType,
            name: accountName,
            username: username || accountName,
            password: password,
            notes: notes,
            createdAt: new Date().toISOString()
        };

        accounts.push(newAccount);
        saveAccounts();
        displayAccounts(accounts);
        accountForm.reset();
        alert('Account added successfully!');
    });

    searchInput.addEventListener('input', filterAccounts);
    filterType.addEventListener('change', filterAccounts);

    function openEditModal(accountId) {
        const account = accounts.find(acc => acc.id === accountId);
        if (!account) return;

        document.getElementById('editAccountId').value = account.id;
        document.getElementById('editAccountType').value = account.type;
        document.getElementById('editAccountName').value = account.name;
        document.getElementById('editUsername').value = account.username;
        document.getElementById('editPassword').value = account.password;
        document.getElementById('editNotes').value = account.notes || '';

        editModal.style.display = 'block';
    }

    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    editAccountForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const accountId = document.getElementById('editAccountId').value;
        const accountType = document.getElementById('editAccountType').value;
        const accountName = document.getElementById('editAccountName').value.trim();
        const username = document.getElementById('editUsername').value.trim();
        const password = document.getElementById('editPassword').value;
        const notes = document.getElementById('editNotes').value.trim();

        const accountIndex = accounts.findIndex(acc => acc.id === accountId);
        if (accountIndex === -1) return;

        accounts[accountIndex] = {
            ...accounts[accountIndex],
            type: accountType,
            name: accountName,
            username: username || accountName,
            password: password,
            notes: notes
        };

        saveAccounts();
        displayAccounts(accounts);
        editModal.style.display = 'none';
        alert('Account updated successfully!');
    });

    function deleteAccount(accountId) {
        if (!confirm('Are you sure you want to delete this account?')) return;

        accounts = accounts.filter(acc => acc.id !== accountId);
        saveAccounts();
        displayAccounts(accounts);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function displayAccounts(accountsToDisplay) {
        accountsContainer.innerHTML = '';

        if (accountsToDisplay.length === 0) {
            accountsContainer.innerHTML = '<p class="no-accounts">No accounts found. Add your first account above.</p>';
            return;
        }

        accountsToDisplay.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            accountCard.setAttribute('data-type', account.type);

            const typeName = account.type.charAt(0).toUpperCase() + account.type.slice(1);

            accountCard.innerHTML = `
                <div class="account-header">
                    <div class="account-icon">
                        <i class="fab fa-${account.type === 'apple' ? 'apple' : account.type}"></i>
                    </div>
                    <div class="account-title">${typeName}</div>
                </div>
                <div class="account-details">
                    <div class="account-detail">
                        <label>Name:</label>
                        <span>${account.name}</span>
                    </div>
                    <div class="account-detail">
                        <label>Username:</label>
                        <span>${account.username}</span>
                    </div>
                    <div class="account-detail">
                        <label>Password:</label>
                        <span class="password-display">••••••••</span>
                    </div>
                    ${account.notes ? `<div class="account-detail">
                        <label>Notes:</label>
                        <span>${account.notes}</span>
                    </div>` : ''}
                </div>
                <div class="account-actions">
                    <button class="action-btn edit-btn" onclick="openEditModal('${account.id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteAccount('${account.id}')">Delete</button>
                    <button class="action-btn copy-btn" onclick="copyAccountInfo('${account.id}')">Copy</button>
                    <button class="action-btn show-btn" onclick="toggleShowPassword('${account.id}', this)">Show</button>
                </div>
            `;

            accountsContainer.appendChild(accountCard);
        });
    }

    function filterAccounts() {
        const searchTerm = searchInput.value.toLowerCase();
        const typeFilter = filterType.value;

        let filteredAccounts = accounts;

        if (typeFilter !== 'all') {
            filteredAccounts = filteredAccounts.filter(acc => acc.type === typeFilter);
        }

        if (searchTerm) {
            filteredAccounts = filteredAccounts.filter(acc =>
                acc.name.toLowerCase().includes(searchTerm) ||
                acc.username.toLowerCase().includes(searchTerm) ||
                (acc.notes && acc.notes.toLowerCase().includes(searchTerm)) ||
                acc.type.toLowerCase().includes(searchTerm)
            );
        }

        displayAccounts(filteredAccounts);
    }

    function saveAccounts() {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    window.togglePasswordVisibility = function() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.querySelector('.toggle-password i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleBtn.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };

    window.toggleEditPasswordVisibility = function() {
        const passwordInput = document.getElementById('editPassword');
        const toggleBtn = document.querySelectorAll('.toggle-password i')[1];

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleBtn.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };

    window.toggleShowPassword = function(accountId, button) {
        const accountCard = button.closest('.account-card');
        const passwordDisplay = accountCard.querySelector('.password-display');
        const account = accounts.find(acc => acc.id === accountId);

        if (!account) return;

        if (passwordDisplay.textContent === '••••••••') {
            passwordDisplay.textContent = account.password;
            button.textContent = 'Hide';
        } else {
            passwordDisplay.textContent = '••••••••';
            button.textContent = 'Show';
        }
    };

    window.copyAccountInfo = function(accountId) {
        const account = accounts.find(acc => acc.id === accountId);
        if (!account) return;

        const textToCopy = `Account: ${account.type}\nName/Email: ${account.name}\nUsername: ${account.username}\nPassword: ${account.password}${account.notes ? `\nNotes: ${account.notes}` : ''}`;

        copyToClipboard(textToCopy);
    };

    window.openEditModal = openEditModal;
    window.deleteAccount = deleteAccount;

    });