// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

import { Message, results } from 'azure-iot-common';
import { ReceiverLink, AmqpMessage } from 'azure-iot-amqp-base';
import { EventEmitter } from 'events';
import { Client } from './client';

export class ServiceReceiver extends EventEmitter implements Client.ServiceReceiver {
  private _receiver: ReceiverLink;

  constructor(receiver: ReceiverLink) {
    super();
    this._receiver = receiver;
    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_001: [The constructor shall subscribe to the `message` event of the `ReceiverLink` object passed as argument.]*/
    this._receiver.on('message', (amqpMessage) => {
      /*Codes_SRS_NODE_SERVICE_RECEIVER_16_006: [The `ServiceReceiver` class shall convert any `AmqpMessage` received with the `message` event from the `ReceiverLink` object into `Message` objects and emit a `message` event with that newly created `Message` object for argument.]*/
      this.emit('message', AmqpMessage.toMessage(amqpMessage));
    });

    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_002: [The constructor shall subscribe to the `error` event of the `ReceiverLink` object passed as argument.]*/
    this._receiver.on('error', (err) => {
      /*Codes_SRS_NODE_SERVICE_RECEIVER_16_007: [Any error event received from the `ReceiverLink` object shall be forwarded as is.]*/
      this.emit('error', err);
    });
  }

  complete(message: Message, done?: Client.Callback<results.MessageCompleted>): void {
    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_003: [The `complete` method shall call the `complete` method on the `ReceiverLink` object and pass it the `AmqpMessage` stored within the `transportObj` property of the `Message` object as well as the `done` callback passed as argument.]*/
    this._receiver.complete(message.transportObj, done);
  }

  abandon(message: Message, done?: Client.Callback<results.MessageAbandoned>): void {
    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_004: [The `abandon` method shall call the `abandon` method on the `ReceiverLink` object and pass it the `AmqpMessage` stored within the `transportObj` property of the `Message` object as well as the `done` callback passed as argument.]*/
    this._receiver.abandon(message.transportObj, done);
  }

  reject(message: Message, done?: Client.Callback<results.MessageRejected>): void {
    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_005: [The `reject` method shall call the `reject` method on the `ReceiverLink` object and pass it the `AmqpMessage` stored within the `transportObj` property of the `Message` object as well as the `done` callback passed as argument.]*/
    this._receiver.reject(message.transportObj, done);
  }

  detach(callback: (err?: Error) => void): void {
    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_008: [The `detach` method shall call the `detach` method on the `ReceiverLink` object and pass it its `callback` argument.]*/
    this._receiver.detach(callback);
  }

  forceDetach(err?: Error): void {
    /*Codes_SRS_NODE_SERVICE_RECEIVER_16_009: [The `forceDetach` method shall call the `forceDetach` method on the `ReceiverLink` object and pass it its `err` argument.]*/
    this._receiver.forceDetach(err);
  }
}
