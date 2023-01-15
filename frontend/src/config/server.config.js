
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// axios.defaults.baseURL = 'http://localhost:4000';


export default axios;