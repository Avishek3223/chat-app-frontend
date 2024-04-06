import axios from 'axios';
import { UserContextProvider } from './UserContext';
import Routes from './Routes';

function App() {
  axios.defaults.baseURL = 'https://chat-app-backend-8pa8mn4yt-avishek3223s-projects.vercel.app';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes/>

    </UserContextProvider>
  )
}

export default App
