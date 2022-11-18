class ManageItem {
	constructor() {
		this.userNameDiv = document.querySelector(".data-profile-name-link");
		this.userImgDiv = document.querySelector(".data-profile-img");
		this.reposDiv = document.querySelector(".data-repos");
		this.containerDiv = document.querySelector(".container");
	}

	makeItem(userName, imgUrl, profileUrl) {
		this.userNameDiv.innerHTML = userName;
		this.userNameDiv.href = profileUrl;
		this.userImgDiv.src = imgUrl;
	}
	addRepoItem(name, language, url) {
		const mainItem = document.createElement("div");
		const repoNameDiv = document.createElement("a");
		const repoLangDiv = document.createElement("p");

		mainItem.className = "repo";
		repoNameDiv.className = "link data-text data-repo-name";
		repoLangDiv.className = "data-text data-repo-lang";

		repoNameDiv.href = url;
		repoNameDiv.target = "_blank";

		repoNameDiv.innerText = name;
		repoLangDiv.innerText = language;

		mainItem.appendChild(repoNameDiv);
		mainItem.appendChild(repoLangDiv);

		this.reposDiv.appendChild(mainItem);
	}
	purgeRepoList() {
		this.reposDiv.innerHTML = "";
	}
	setLoading(state) {
		if (state) {
			this.containerDiv.classList.add("container--loading");
		} else {
			this.containerDiv.classList.remove("container--loading");
		}
	}
}

class DataDownloader {
	constructor() {}
	async getUserData(username) {
		const url = `https://api.github.com/users/${username}`;
		const data = await fetch(url);
		const dataJson = await data.json();
		return dataJson;
	}
	async getUserRepos(url) {
		const data = await fetch(url);
		const dataJson = await data.json();
		return dataJson;
	}
}

class Controller {
	constructor(dataCtrl, itemCtrl) {
		this.inputDiv = document.querySelector(".search-input");
		this.btnDiv = document.querySelector(".search-btn");

		this.dataCtrl = new dataCtrl();
		this.itemCtrl = new itemCtrl();

		this.addListeners();
	}

	addListeners() {
		this.btnDiv.addEventListener("click", this.handleAction);
		window.addEventListener("keypress", (e) => {
			if (e.key == "Enter") {
				this.handleAction();
			}
		});
	}

	handleAction = async () => {
		this.itemCtrl.setLoading(true);

		this.itemCtrl.purgeRepoList();

		const username = this.inputDiv.value;

		this.userData = await this.dataCtrl.getUserData(username);

		const { login, avatar_url, repos_url } = this.userData;
		this.itemCtrl.makeItem(login, avatar_url);

		const reposList = await this.dataCtrl.getUserRepos(repos_url);

		for (const repo of reposList) {
			const { name, language, html_url } = repo;
			this.itemCtrl.addRepoItem(name, language, html_url);
		}
		this.itemCtrl.setLoading(false);
	};
}

const ctrl = new Controller(DataDownloader, ManageItem);
