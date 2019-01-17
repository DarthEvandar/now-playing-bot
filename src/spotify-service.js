class SpotifyService {
  baseURL = 'https://api.spotify.com/v1';

  getUser(auth) {
    return this.http.get(`${this.baseURL}/me`, {headers: this.constructHeaders(auth)});
  }

  

//   constructHeaders(auth) {
//     return new HttpHeaders({
//       'Content-Type':  'application/json',
//       'Authorization': `Bearer ${auth}`
//     });
//   }

  getCurrentlyPlaying(auth) {
    return this.http.get(`${this.baseURL}/me/player/currently-playing`, {headers: this.constructHeaders(auth)});
  }

}

export default SpotifyService;
