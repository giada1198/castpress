'use strict';

const DATABASEURL = 'js/database.json';
let isAdminLogin = false;
let isEditingOverview = false;
let indicatorState = 'overview';
let nowPlayingEpisode = 0;
let database;

function renderHeader(data) {
    let header = document.querySelector('.header-texts');
    header.innerHTML = '';
    let title = document.createElement('h1');
    title.textContent = data.name;

    // login button
    let loginButton = document.createElement('button');
    loginButton.classList.add('login');
    if(isAdminLogin === true) {
        loginButton.textContent = 'Sign Out';
    } else {
        loginButton.textContent = 'Login';
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
    renderModal(data)
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
        editButton.innerHTML = '<img src="img/icons/edit-text.svg" alt="edit the overview section"/>';
        editButton.addEventListener('click', () => {
            isEditingOverview = !isEditingOverview;
            renderContent(data);
        });
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
    
    // Apple Podcasts icon
    let ap = document.createElement('a');
    ap.classList.add('link');
    ap.title = 'Apple Podcasts';
    ap.href = data.links['apple-podcasts'];
    ap.target = '_blank';
    ap.setAttribute('aria-label', 'Go to the podcast page on Apple Podcasts');
    ap.appendChild(links);
    ap.innerHTML = '<i class="fa fa-podcast" aria-hidden="true"></i>';
    links.appendChild(ap);
    
    // Spotify icon
    let sf = document.createElement('a');
    sf.classList.add('link');
    sf.title = 'Spotify';
    sf.href = data.links['spotify'];
    sf.target = '_blank';
    sf.setAttribute('aria-label', 'Go to the podcast page on Spotify')
    sf.appendChild(links);
    sf.innerHTML = '<i class="fa fa-spotify" aria-hidden="true"></i>';
    links.appendChild(sf);
    
    // Google Podcasts icon
    let gp = document.createElement('a');
    gp.classList.add('link');
    gp.title = 'Apple Podcasts';
    gp.href = data.links['google-podcasts'];
    gp.target = '_blank';
    gp.setAttribute('aria-label', 'Go to the podcast page on Google Podcasts')
    gp.appendChild(links);
    gp.innerHTML = '<i class="fa fa-android" aria-hidden="true"></i>';
    links.appendChild(gp);

    overview.appendChild(links);
}

function renderHosts(data) {
    let overview = document.querySelector('.overview-editable');
    let hostOrder = 0;
    data.hosts.forEach((host) => {
        hostOrder += 1;
        let h = document.createElement('div');
        h.classList.add('host');
        if(isAdminLogin == true) {
            let buttons = document.createElement('div');
            buttons.classList.add('edit-buttons');
            
            // Edit host button
            let editButton = document.createElement('button');
            editButton.classList.add('inactive');
            editButton.innerHTML = '<img src="img/icons/edit-text.svg" alt="edit profile of the host"/>';
            buttons.appendChild(editButton);

            // Add host button
            if(hostOrder === data.hosts.length) {
                let addButton = document.createElement('button');
                addButton.classList.add('inactive');
                addButton.innerHTML = '<img src="img/icons/edit-add.svg" alt="add a new host profile"/>';
                buttons.appendChild(addButton);
            }
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

function renderModal(data) {
    let forModal = document.querySelector('#forModal');
    forModal.innerHTML = ''
    if(isEditingOverview) {
        let modal = document.createElement('div');
        modal.classList.add('modal');
        // modal.addEventListener('click', (event) => {
        //     if(event.target == modal) {
        //         isEditingOverview = false;
        //         renderContent(data);
        //     };
        // });
        let modalWindow = document.createElement('div');
        modalWindow.classList.add('modal-window');

        // modal top bar
        let topBar = document.createElement('div');
        topBar.classList.add('modal-top-bar');
        let closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
        closeButton.addEventListener('click', () => {
            isEditingOverview = false;
            renderContent(data);
        });
        let saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.innerText = 'Save';
        saveButton.addEventListener('click', () => {
            data.overview['primary-description'] = d1input.value;
            data.overview['secondary-description'] = d2input.value;
            data.links['apple-podcasts'] = d3input.value;
            data.links['spotify'] = d4input.value;
            data.links['google-podcasts'] = d5input.value;
            isEditingOverview = false;
            renderContent(data);
        });
        topBar.appendChild(closeButton);
        topBar.appendChild(saveButton);

        // modal content
        let content = document.createElement('div');
        content.classList.add('modal-content');

        // primary description (d1)
        let d1 = document.createElement('div');
        d1.innerHTML = '<label for="primary description">Primary Description</label>';
        let d1input = document.createElement('textarea');
        d1input.id = 'primary description';
        d1input.rows = 3;
        d1input.name = 'primary_description';
        d1input.value = data.overview['primary-description']
        d1.appendChild(d1input);
        content.appendChild(d1);

        // secondary Description (d2)
        let d2 = document.createElement('div');
        d2.innerHTML = '<label for="secondary description">Secondary Description</label>';
        let d2input = document.createElement('textarea');
        d2input.id = 'secondary description';
        d2input.rows = 3;
        d2input.name = 'secondary_description';
        d2input.value = data.overview['secondary-description']
        d2.appendChild(d2input);
        content.appendChild(d2);

        // Apple Podcasts link (d3)
        let d3 = document.createElement('div');
        d3.innerHTML = '<label for="apple podcasts">Apple Podcasts</label>';
        let d3input = document.createElement('input');
        d3input.id = 'apple podcasts';
        d3input.type = 'url';
        d3input.name = 'apple_podcasts_link';
        d3input.value = data.links['apple-podcasts']
        d3.appendChild(d3input);
        content.appendChild(d3);

        // Spotify link (d4)
        let d4 = document.createElement('div');
        d4.innerHTML = '<label for="spotify">Spotify</label>';
        let d4input = document.createElement('input');
        d4input.id = 'spotify';
        d4input.type = 'url';
        d4input.name = 'spotify_link';
        d4input.value = data.links['spotify']
        d4.appendChild(d4input);
        content.appendChild(d4);

        // Google Podcasts link (d5)
        let d5 = document.createElement('div');
        d5.innerHTML = '<label for="google podcasts">Google Podcasts</label>';
        let d5input = document.createElement('input');
        d5input.id = 'google podcasts';
        d5input.type = 'url';
        d5input.name = 'google_podcasts_link';
        d5input.value = data.links['google-podcasts']
        d5.appendChild(d5input);
        content.appendChild(d5);

        modalWindow.appendChild(topBar);
        modalWindow.appendChild(content);
        modal.appendChild(modalWindow);
        forModal.appendChild(modal);
    }
}

function renderEpisodes(data) {
    let episodesList = document.querySelector('.episodes');
    episodesList.innerHTML = '';
    data.episodes.forEach((episode) => {
        let ep = document.createElement('div');
        ep.classList.add('episode');

        // if(isAdminLogin == true) {
        //     let buttons = document.createElement('div');
        //     buttons.classList.add('edit-buttons');
        //     let editButton = document.createElement('button');
        //     // buttons.classList.add('edit-buttons')
        //     editButton.innerHTML = '<img src="img/icons/edit-text.svg" alt="edit this podcast episode"/>';
        //     buttons.appendChild(editButton);
        //     ep.appendChild(buttons);
        // }
        
        // episode cover
        let cover = document.createElement('div');
        cover.setAttribute('style', 'background-image: url(' + episode['cover-photo'] + ');');
        cover.classList.add('episode-cover');

        // episode description
        let description = document.createElement('div');
        description.classList.add('episode-description');
        let number = document.createElement('h3');
        number.innerText = 'Episode ' + episode.episode;
        let title = document.createElement('h4');
        title.innerText = episode.title;
        description.appendChild(number);
        description.appendChild(title);
        ep.appendChild(cover);
        ep.appendChild(description);
        episodesList.appendChild(ep);
    });
}

function renderNowPlaying(data) {
    renderNowPlayingDesktop(data);
    renderNowPlayingMobile(data);
}

function renderNowPlayingDesktop(data) {
    let nowPlayingDesktop = document.querySelector('.now-playing-info-desktop');
    nowPlayingDesktop.innerHTML = '';
    let cover = document.createElement('div');
    cover.classList.add('now-playing-episode-cover');
    let style = 'background-image: url(' + data.episodes[nowPlayingEpisode]['cover-photo'] + ');';
    cover.setAttribute('style', style);
    
    let d = document.createElement('div');
    let ep = document.createElement('div');
    ep.classList.add('ep');
    ep.textContent = 'Episode ' + data.episodes[nowPlayingEpisode]['episode'];
    let title = document.createElement('div');
    title.classList.add('title');
    title.textContent = data.episodes[nowPlayingEpisode]['title'];
    d.appendChild(ep);
    d.appendChild(title);

    nowPlayingDesktop.appendChild(cover);
    nowPlayingDesktop.appendChild(d);
}

function renderNowPlayingMobile(data) {
    let nowPlayingMobile = document.querySelector('.now-playing-info-mobile');
    nowPlayingMobile.innerHTML = '';
    let ep = document.createElement('div');
    ep.classList.add('ep');
    ep.textContent = 'Episode ' + data.episodes[nowPlayingEpisode]['episode'];
    let title = document.createElement('div');
    title.classList.add('title');
    title.textContent = data.episodes[nowPlayingEpisode]['title'];
    nowPlayingMobile.appendChild(ep);
    nowPlayingMobile.appendChild(title);
}

function togglerSpinner() {
	document.querySelector('.fa-spinner').classList.toggle('.spinner-inactive');
}

function renderError(error) {
    let overview = document.querySelector('.overview-editable');
    let message = document.createElement('p');
    message.innerText = error;
    overview.appendChild(message);
}

function fetchDatabase(url) {
    togglerSpinner();
	let promise = fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
            database = JSON.parse(JSON.stringify(data));

            // sort episodes from latest to oldest
            database.episodes.sort((episode1, episode2) => episode2.episode - episode1.episode);

            // render each section
            renderHeader(database);
            renderContent(database);
            renderEpisodes(database);
            renderNowPlaying(database);

		})
		.catch((error) => {
			renderError(error);
        })
        .then(togglerSpinner);
    return promise;
}

// overview indicators
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

// player interface
let backwardButton = document.querySelector('.step-backward-button');
backwardButton.addEventListener('click', () => {
    nowPlayingEpisode = (nowPlayingEpisode + 1) % database.episodes.length;
    renderNowPlaying(database);
});

let forwardButton = document.querySelector('.step-forward-button');
forwardButton.addEventListener('click', () => {
    nowPlayingEpisode = (nowPlayingEpisode - 1 + database.episodes.length) % database.episodes.length;
    renderNowPlaying(database);
});

fetchDatabase(DATABASEURL);