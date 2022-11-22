import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    sendMessage(uuid: string, message: string) {
      this.subject.next({ uuid: uuid, text: message });
    }

    onMessage(): Observable<any> {
      return this.subject.asObservable();
    }
}