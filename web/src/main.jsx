const React = require('react');
const ReactDOM = require('react-dom/client');
const App = require('./App');
require('./styles.css');
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
