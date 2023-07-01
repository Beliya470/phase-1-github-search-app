// Constants for API endpoints
const BASE_URL = 'https://api.github.com';
const SEARCH_USERS_ENDPOINT = '/search/users';
const USER_REPOS_ENDPOINT = '/users';

// Selectors
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const userRepos = document.getElementById('userRepos');

// Event listener for form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  const searchValue = searchInput.value.trim();
  if (searchValue) {
    searchUsers(searchValue);
    searchInput.value = ''; // Clear the search input
  }
});

// Function to search users
function searchUsers(query) {
  const url = `${BASE_URL}${SEARCH_USERS_ENDPOINT}?q=${query}`;

  fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(response => response.json())
    .then(data => displayUsers(data.items))
    .catch(error => console.error('Error:', error));
}

// Function to display search results (users)
function displayUsers(users) {
  searchResults.innerHTML = ''; // Clear previous search results

  if (users.length === 0) {
    searchResults.textContent = 'No users found.';
    return;
  }

  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.innerHTML = `
      <h3>${user.login}</h3>
      <img src="${user.avatar_url}" alt="${user.login}'s avatar">
      <a href="${user.html_url}" target="_blank">View Profile</a>
    `;
    userElement.addEventListener('click', () => {
      getUserRepos(user.login);
    });
    searchResults.appendChild(userElement);
  });
}

// Function to get user repositories
function getUserRepos(username) {
  const url = `${BASE_URL}${USER_REPOS_ENDPOINT}/${username}/repos`;

  fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(response => response.json())
    .then(data => displayUserRepos(data))
    .catch(error => console.error('Error:', error));
}

// Function to display user repositories
function displayUserRepos(repos) {
  userRepos.innerHTML = ''; // Clear previous user repositories

  if (repos.length === 0) {
    userRepos.textContent = 'No repositories found for this user.';
    return;
  }

  const reposList = document.createElement('ul');
  repos.forEach(repo => {
    const repoElement = document.createElement('li');
    repoElement.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;
    reposList.appendChild(repoElement);
  });
  userRepos.appendChild(reposList);
}
