export function authHeader() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.username !== '' && user.token !== '') {
            return { 'x-access-token': user.token }
        } else {
            return null;
        }
    } else {
        return null;
    }
}