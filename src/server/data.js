module.exports = {
  getUser: getUser
};

function getUser(username, password) {
  var users = [
    {
      id: 1, username: 'test', password: '123', name: 'Test User', title: 'Mr',
      firstname: 'Test', lastname: 'User',
      email: 'me14567@gmail.com', organization: 'Liverpool fc', duties: 'Kit Man',
      company: 'First team', address: '1 Anfield Road', cityState: 'Ontario, California',
      countryZipCode: 'USA, 67890' , phone: '8293778238378',
      country: 'USA', zipCode: '67890',city: 'Ontario', state: 'California'
    },

    {
      id: 2, username: 'admin', password: '123', name: 'Admin User', title: 'Miss',
      firstname: 'Admin', lastname: 'User',
      organization: 'Everton fc', duties: 'Ball boy', company: 'Reserves',
      address: '1 The Kop', cityState: 'San Antonio, Texas', countryZipCode: 'USA, 67891',
      phone: '3256452674542', email: 'test1@gmail.com',
      country: 'USA', zipCode: '67891', city: 'San Antonio', state: 'Texas'
    },
    {
      id: 3, username: 'user', password: '123', name: 'Dear User', title: 'Dr',
      firstname: 'Dear', lastname: 'User',
      organization: 'Manchester fc',duties: 'Steward', company: 'Under 21s',
      address: '1 Centenary Stand', cityState: 'Oakland, California',
      countryZipCode: 'USA, 64590', phone: '5351345134314', email: 'test456@gmail.com',
      country: 'USA', zipCode: '64590', city: 'Oakland', state: 'California'
    }
  ];
  var found = null;

  for (var i = 0; i < users.length; i++) {
    var element = users[i];
    if (element.username === username && element.password === password) {
      found = element;
      break;
    }
  }
  return found;
}
