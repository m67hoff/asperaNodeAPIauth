## external node.js based authentication for Aspera NodeAPI
[![Dependencies Status](https://david-dm.org/m67hoff/asperaNodeAPIauth.svg)](https://david-dm.org/m67hoff/asperaNodeAPIauth)

**currently Linux only!**

users need to use their system-user (aspera transfer user) to authenticate!
if authentication is set to external_auth, NodeAPI does not translate the username that was sent to NodeAPI before calling this external_auth provider.

If the external_auth fails,  NodeAPI itself retries the given user & password with the default `asnodeadmin -au node_user -p node_password -x system_user`
configuration.

Flow is:
    
    User (HTTP Basic) ->  NodeAPI ->  external_auth service ->  Authentication OK ?
        Yes -> NodeAPI returns authenticated - with the HTTP Basic Username as transfer User
        No  -> authentication request falls back to standard NodeAPI auth -> NodeAPI (asnodeadmin -u) auth OK?
            No -> NodeAPI returns authentication error
            Yes ->  NodeAPI returns authenticated - with the HTTP Basic Username translated to the transfer User (asnodeadmin -l) 


### aspera.conf settings 

set section (no asconfigurator possibility):
```
<server>
  <authentication>
    <provider>
      <type>external_auth</type>
      <spec>http://localhost:5555</spec>
    </provider>
 </authentication>
</server>

```
restart Aspera NodeAPI service: `systemctl restart asperanoded`

### node.js rest service with pam auth 

start `node sever.js` this has simple pam authentication 
and listen on the above port to authenticate users to linux system auth.  

### Todo
- npm module
- windows 
- start as service
- ...