import TokenService from '../services/token-service';

const EventItemsService = {
  getItems() {
    return fetch('https://doubletake-william.herokuapp.com/api/eventItems/', {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
  },

  postItem(newItem, listId) {
    return fetch(`https://doubletake-william.herokuapp.com/api/eventItems/${listId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(newItem)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
  },

  getSpecificItem(listId, itemId) {
    return fetch(`https://doubletake-william.herokuapp.com/api/eventItems/${listId}/${itemId}`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => (!res.ok)
        ? res.json().then(err => Promise.reject(err))
        : res.json()
      )
  },

  deleteItem(listId, itemId) {
    return fetch(`https://doubletake-william.herokuapp.com/api/eventItems/${listId}/${itemId}`, {
      method: 'DELETE',
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
      })
  },

  editItem(listId, itemId, editItem) {
    return fetch(`https://doubletake-william.herokuapp.com/api/eventItems/${listId}/${itemId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(editItem)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
      })
  }
}

export default EventItemsService;