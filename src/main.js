document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const themeToggleButton = document.getElementById('header-button');
  const searchInput = document.getElementById('search');
  const searchButton = document.querySelector('.searchBar__button');
  const errorMessage = document.getElementById('search-err');
  const body = document.body;

  // Elements within the profile card
  const avatar = document.querySelector('.profile-info__avatar');
  const userName = document.getElementById('obj-name');
  const userLogin = document.getElementById('obj-username');
  const joinDate = document.getElementById('obj-date');
  const bio = document.getElementById('obj-bio'); 
  const repos = document.querySelector('#grid-data p:nth-child(4)');
  const followers = document.querySelector('#grid-data p:nth-child(5)');
  const following = document.querySelector('#grid-data p:nth-child(6)');
  const locationEl = document.getElementById('obj-location');
  const websiteEl = document.getElementById('obj-website');
  const twitterEl = document.getElementById('obj-twitter');
  const companyEl = document.getElementById('obj-company');

  const API_URL = 'https://api.github.com/users/';

  // Update UI Theme
  const updateThemeUI = (theme) => {
    const themeText = theme === 'light' ? 'Dark' : 'Light';
    const themeIcon = theme === 'light' ? 'icon-moon.svg' : 'icon-sun.svg';

    themeToggleButton.innerHTML = `
      ${themeText}
      <img class="header__icons" src="/src/images/${themeIcon}" alt="icon-${theme}-mode" />
    `;

    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    themeToggleButton.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateThemeUI(savedTheme);
  };

  themeToggleButton.addEventListener('click', () => {
    const currentTheme = themeToggleButton.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateThemeUI(newTheme);
  });

  const fetchUser = async (username) => {
    if (!username || username.trim() === '') {
      errorMessage.style.display = 'block';
      return;
    }

    errorMessage.style.display = 'none';

    try {
      const response = await fetch(API_URL + username);

      if (!response.ok) {
        if (response.status === 404) {
          errorMessage.style.display = 'block';
        }
        return;
      }

      const data = await response.json();
      updateProfileInfo(data);

    } catch (error) {
      console.error("Error fetching user data:", error);
      errorMessage.style.display = 'block';
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `Joined ${day} ${month} ${year}`;
  };

  const updateProfileInfo = (user) => {
    avatar.src = user.avatar_url;
    userName.textContent = user.name || user.login;
    userLogin.textContent = `@${user.login}`;
    userLogin.href = user.html_url;
    joinDate.textContent = formatJoinDate(user.created_at);
    bio.textContent = user.bio || 'This profile has no bio';
    repos.textContent = user.public_repos;
    followers.textContent = user.followers;
    following.textContent = user.following;

    updateSocialLink(locationEl, user.location);
    updateSocialLink(websiteEl, user.blog, true);
    updateSocialLink(twitterEl, user.twitter_username, true, `https://twitter.com/${user.twitter_username}`);
    updateSocialLink(companyEl, user.company);
  };

  const updateSocialLink = (element, value, isLink = false, linkHref = '') => {
    const listItem = element.closest('li');
    if (value) {
      element.textContent = value;
      if (isLink) {
        element.href = linkHref || value;
      }
      listItem.classList.remove('not-available');
    } else {
      element.textContent = 'Not Available';
      if (isLink) {
        element.removeAttribute('href');
      }
      listItem.classList.add('not-available');
    }
  };

  searchButton.addEventListener('click', () => {
    fetchUser(searchInput.value.trim());
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      fetchUser(searchInput.value.trim());
    }
  });

  initTheme();
  fetchUser('octocat');
});
