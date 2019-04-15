var pam = require('authenticate-pam')

pam.authenticate('mhoff', 'demoaspera',
  (err) => {
    if (err) { console.log(err) }
    else { console.log('Authenticated!') }
  },
  { serviceName: 'sshd', remoteHost: 'localhost' }
)
