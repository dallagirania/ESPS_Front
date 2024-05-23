import {Injectable} from "@angular/core";

import { environment } from "../../environments/environment";

 

const SockJs = require('sockjs-client');

const Stomp = require('stompjs');

 

@Injectable({

  providedIn: 'root',

})

export class WebSocketService {

  stompClient = null;

  connected = false;

  link ="http://localhost:8081/api/";

 

  constructor() {

  }

 

  // Open connection with the back-end socket

  public connect() {

    const socket = new SockJs(this.link+'socket');

    this.stompClient = Stomp.over(socket);

    this.stompClient.debug = () => {

    };

    return this.stompClient;

  }

 

  public disconnect() {

    if (this.stompClient !== null && this.connected) {

      this.stompClient.disconnect();

      this.connected = false;

    }

  }

}