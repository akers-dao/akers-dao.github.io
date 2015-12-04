/**
 * Wrapper for the window.localStorage
 */
class LocalStorage {
  constructor() {
    /**
     * The key name for window.localStorage
     * @type{string} dbName
     */
    this.dbName = 'places';
  }
    /**
     * Retrieves the list of places from window.localStorage
     * @return{array<object>} The list of places
     */
  get db() {
    let item = JSON.parse(window.localStorage.getItem(this.dbName));
    item = (typeof item === 'object') ? item : null;
    const db = (item) ? item.db : [];
    return db;
  }
    /**
     * Set the object on window.localStorage
     * @param {string} item - The name of the place to add
		 * @return {undefined}
     */
  set db(item) {
    const index = (this.db) ? this.db.indexOf(item) : -1;
    if (index === -1) {
      window.localStorage.setItem(this.dbName, JSON.stringify({
        db: item
      }));
    }
  }
    /**
     * Remove a single place item from window.localStorage
     * @param {string} item - The name of the place to remove
		 * @return {undefined}
     */
  removeItem(item) {
    const index = this.db.indexOf(item);
    const temp = this.db;
    if (index !== -1) {
      temp.splice(index, 1);
      this.db = temp;
    }
  }
    /**
     * Remove all place items from window.localStorage
		 * @return {undefined}
     */
  remove() {
    window.localStorage.removeItem(this.dbName);
  }
}

export default LocalStorage;
