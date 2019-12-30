let user;

class User {
  constructor() {
    this.retrieveUser();
    this.user = null;
    this.character = null;
  }

  retrieveUser = () => {
    this.fetching = fetch('/~rakel/protogame/api/v1/lusers/me', {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response)=>response.json()).then((data)=>{
      this.fetching = false;
      this.id = data.id;
      this.username = data.username;
      this.roles = data.roles;
      this.playerCharacter = data.playerCharacter;
    })
    return this.fetching;
  }
}

export const getUser = () => {
  if(!user) {
    user = new User();
  }
  return user;
}

