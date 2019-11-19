'use strict';

const databaseURL = 'js/database.json';
let isAdminLogin = false;
let indicatorState = 'overview';
let database;

function renderHeader(data) {
    let header = document.querySelector('.header-texts');
    header.innerHTML = '';
    let title = document.createElement('h1');
    title.textContent = data.name;
    let loginButton = document.createElement('button');
    loginButton.classList.add('login');
    if(isAdminLogin === true) {
        loginButton.textContent = 'Sign out';
    } else {
        loginButton.textContent = 'Admin Login';
    }
    loginButton.addEventListener('click', () => {
        isAdminLogin = !isAdminLogin;
        renderHeader(data);
        renderContent(data);
        renderEpisodes(data);
    });
    header.appendChild(title);
    header.appendChild(loginButton);
}

function renderContent(data) {
    if(indicatorState === 'overview') {
        document.querySelector('.overview-editable').innerHTML = '';
        renderOverview(data);
    } else if(indicatorState === 'hosts') {
        document.querySelector('.overview-editable').innerHTML = '';
        renderHosts(data);
    }
}

function renderOverview(data) {
    let overview = document.querySelector('.overview-editable');
    if(isAdminLogin == true) {
        let buttons = document.createElement('div');
        buttons.classList.add('edit-buttons');
        let editButton = document.createElement('button');
        // buttons.classList.add('edit-buttons')
        editButton.innerHTML = '<img src="img/icons/edit-text.svg" alt="Flowers in Chania"/>';
        buttons.appendChild(editButton);
        overview.appendChild(buttons);
    }
    let pd = document.createElement('h2');
    pd.textContent = data.overview['primary-description'];
    overview.appendChild(pd);
    let sd = document.createElement('p');
    sd.textContent = data.overview['secondary-description'];
    overview.appendChild(sd);
    let links = document.createElement('div');
    links.classList.add('links');

    // Apple Podcasts Icon
    let ap = document.createElement('a');
    ap.classList.add('link');
    ap.title = 'Apple Podcasts';
    ap.setAttribute('aria-label', 'Go to the podcast page on Apple Podcasts')
    ap.setAttribute('href', data.links['apple-podcasts']);
    ap.appendChild(links);
    ap.innerHTML = '<i class="fa fa-podcast" aria-hidden="true"></i>';
    links.appendChild(ap);

    // Spotify Icon
    let sf = document.createElement('a');
    sf.classList.add('link');
    sf.title = 'Spotify';
    sf.setAttribute('aria-label', 'Go to the podcast page on Spotify')
    sf.setAttribute('href', data.links['spotify']);
    sf.appendChild(links);
    sf.innerHTML = '<i class="fa fa-spotify" aria-hidden="true"></i>';
    links.appendChild(sf);

    // Google Podcasts Icon
    let gp = document.createElement('a');
    gp.classList.add('link');
    gp.title = 'Apple Podcasts';
    gp.setAttribute('aria-label', 'Go to the podcast page on Google Podcasts')
    gp.setAttribute('href', data.links['google-podcasts']);
    gp.appendChild(links);
    gp.innerHTML = '<i class="fa fa-android" aria-hidden="true"></i>';
    links.appendChild(gp);

    overview.appendChild(links);
}

function renderHosts(data) {
    let overview = document.querySelector('.overview-editable');
    data.hosts.forEach((host) => {
        let h = document.createElement('div');
        h.classList.add('host');
        if(isAdminLogin == true) {
            let buttons = document.createElement('div');
            buttons.classList.add('edit-buttons');
            let editButton = document.createElement('button');
            // buttons.classList.add('edit-buttons')
            editButton.innerHTML = '<img src="img/icons/edit-text.svg" alt="Flowers in Chania"/>';
            buttons.appendChild(editButton);
            h.appendChild(buttons);
        }

        let photo = document.createElement('div');
        photo.classList.add('photo');
        photo.setAttribute('style', 'background-image: url(' + host.photo + ');');
        h.appendChild(photo);

        let intro = document.createElement('div');
        h.classList.add('introduction');
        let name = document.createElement('h3');
        name.innerText = host.name;
        intro.appendChild(name);
        let description = document.createElement('p');
        description.innerText = host.description;
        intro.appendChild(description);
        h.appendChild(intro);

        overview.appendChild(h);
    });
}

function renderEpisodes(data) {
    let episodesList = document.querySelector('.episodes');
    episodesList.innerHTML = '';
    let episodes = data.episodes;
    episodes.sort((episode1, episode2) => episode2.episode - episode1.episode);
    episodes.forEach((episode) => {
        let ep = document.createElement('div');
        ep.classList.add('episode');
        if(isAdminLogin == true) {
            let buttons = document.createElement('div');
            buttons.classList.add('edit-buttons');
            let editButton = document.createElement('button');
            // buttons.classList.add('edit-buttons')
            editButton.innerHTML = '<img src="img/icons/edit-text.svg" alt="Flowers in Chania"/>';
            buttons.appendChild(editButton);
            ep.appendChild(buttons);
        }
        let cover = document.createElement('div');
        cover.setAttribute('style', 'background-image: url(' + episode['cover-photo'] + ');');
        cover.classList.add('episode-cover');
        let description = document.createElement('div');
        description.classList.add('episode-description');
        let number = document.createElement('h4');
        number.innerText = 'Episode ' + episode.episode;
        let title = document.createElement('h3');
        title.innerText = episode.title;
        description.appendChild(number);
        description.appendChild(title);
        ep.appendChild(cover);
        ep.appendChild(description);
        episodesList.appendChild(ep);
    });
}

function fetchDatabase(url) {
	let promise = fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
            database = JSON.parse(JSON.stringify(data));
            renderOverview(database);
            renderEpisodes(database);
            renderHeader(database)
		})
		.catch((err) => {
			console.log(err);
        })
    return promise;
}

let overviewIndicator = document.querySelector('#to-overview');
overviewIndicator.addEventListener('click', () => {
    if(indicatorState != 'overview') {
        indicatorState = 'overview';
        hostsIndicator.classList.remove('active');
        overviewIndicator.classList.add('active');
        renderContent(database);
    }
});

let hostsIndicator = document.querySelector('#to-hosts');
hostsIndicator.addEventListener('click', () => {
    if(indicatorState != 'hosts') {
        indicatorState = 'hosts';
        overviewIndicator.classList.remove('active');
        hostsIndicator.classList.add('active');
        renderContent(database);
    }
});

fetchDatabase(databaseURL);