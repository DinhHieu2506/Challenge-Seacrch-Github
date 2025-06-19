document.addEventListener('DOMContentLoaded', () => {
  // --- Constants ---
  const API_URL = 'https://api.github.com/users/';
  const body = document.body;

  // --- DOM Elements ---
  const themeToggleButton = document.getElementById('header-button');
  const searchInput = document.getElementById('search');
  const searchButton = document.querySelector('.searchBar__button');
  const errorMessage = document.getElementById('search-err');

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

  // --- Theme ---
  const updateThemeUI = (theme) => {
    const themeText = theme === 'light' ? 'Dark' : 'Light';
    const themeIcon = theme === 'light' ? 'icon_moon.svg' : 'icon_sun.svg';

    themeToggleButton.innerHTML = `
      ${themeText}
      <img class="header__icons" src="/public/images/${themeIcon}" alt="icon-${theme}-mode" />
    `;

    body.classList.toggle('dark-mode', theme === 'dark');
    themeToggleButton.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateThemeUI(savedTheme);
  };

  themeToggleButton.addEventListener('click', () => {
    const currentTheme = themeToggleButton.dataset.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateThemeUI(newTheme);
  });

  // --- Fetch User ---
  const fetchUser = async (username) => {
    if (!username.trim()) {
      showError(true);
      return;
    }

    showError(false);

    try {
      const res = await fetch(`${API_URL}${username}`);
      if (!res.ok) {
        if (res.status === 404) showError(true);
        return;
      }
      const userData = await res.json();
      updateProfileInfo(userData);
    } catch (err) {
      console.error('Fetch error:', err);
      showError(true);
    }
  };

  // --- Show Error ---
  const showError = (show) => {
    errorMessage.style.display = show ? 'block' : 'none';
  };

  // --- Format Date ---
  const formatJoinDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `Joined ${day} ${month} ${year}`;
  };

  // --- Update UI with Data ---
  const updateProfileInfo = (user) => {
    avatar.src = user.avatar_url;
    userName.textContent = user.name ?? user.login;
    userLogin.textContent = `@${user.login}`;
    userLogin.href = user.html_url;
    joinDate.textContent = formatJoinDate(user.created_at);
    bio.textContent = user.bio ?? 'This profile has no bio';
    repos.textContent = user.public_repos;
    followers.textContent = user.followers;
    following.textContent = user.following;

    updateSocial(locationEl, user.location);
    updateSocial(websiteEl, user.blog, true);
    updateSocial(twitterEl, user.twitter_username, true, `https://twitter.com/${user.twitter_username}`);
    updateSocial(companyEl, user.company);
  };

  // --- Update Social Info ---
  const updateSocial = (element, value, isLink = false, href = '') => {
    const listItem = element.closest('li');
    if (value) {
      element.textContent = value;
      if (isLink) element.href = href || value;
      listItem?.classList.remove('not-available');
    } else {
      element.textContent = 'Not Available';
      if (isLink) element.removeAttribute('href');
      listItem?.classList.add('not-available');
    }
  };

  // --- Event Listeners ---
  searchButton.addEventListener('click', () => fetchUser(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fetchUser(searchInput.value);
  });

  // --- Init ---
  initTheme();
  fetchUser('octocat');
});
