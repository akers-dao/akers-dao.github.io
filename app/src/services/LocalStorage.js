class LocalStorage {
	constructor() {
		this.dbName = "places";
	}

	get db() {
		let item = JSON.parse(window.localStorage.getItem(this.dbName));
		item = (typeof item === "object") ? item : null;
		let db = (item) ? item.db : [];
		return db
	}

	set db(value) {
		let index = (this.db) ? this.db.indexOf(value) : -1;
		if (index === -1) {
			window.localStorage.setItem(this.dbName, JSON.stringify({ db: value }));
		}
	}
	
	removeItem(item){
		let index = this.db.indexOf(item);
		let temp = this.db;
		console.log(this.db, index)
		if (index !== -1) {
			temp.splice(index,1);
			this.db = temp;
		}
	}
	
	remove(){
		window.localStorage.removeItem(this.dbName);
	}
}

export default LocalStorage