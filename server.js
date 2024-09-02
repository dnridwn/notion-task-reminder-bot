require('dotenv').config();
require('./migration');
require('./bot');
require('./scheduler');

console.log('Service is running...');
