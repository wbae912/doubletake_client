const AuthApiService = {
  postLogin(credentials) {
    return fetch('https://doubletake-william.herokuapp.com/api/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    })
  }
}

export default AuthApiService;