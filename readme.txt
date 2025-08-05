this repository is for creating a web-based kubernetes wizrd that has a pseudo terminal.

The right pane should have recipes for kubernetes cluster administration.

The right pane should have a pseudo terminal that can be used to connect to the cluster nodes via ssh, or to send kubectl commands to the kubernetes api in order to complete common tasks.

the nestjs app should export a command line interface

command: kubernetes-wizard

When you type kubernetes-wizard into the command line, a webserver should start up and be listening on

http://localhost:7777

When you travel to http://localhost:7777 with your browser you will be able to use the app interactively to handle your kubernetes cluster within the browser.
