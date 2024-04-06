import axios from 'axios';
import { UserContextProvider } from './UserContext';
import Routes from './Routes';

function App() {
  axios.defaults.baseURL = 'https://chat-app-backend-e08k.onrender.com';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes/>

    </UserContextProvider>
  )
}

export default App
