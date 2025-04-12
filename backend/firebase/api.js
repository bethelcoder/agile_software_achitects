const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      console.log('User logged in: ', user.displayName);
    } catch (error) {
      console.error('Error signing in: ', error.message);
    }
  };
  
  const logout = async () => {
    try {
      await firebase.auth().signOut();
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out: ', error.message);
    }
  };

  export { login, logout };