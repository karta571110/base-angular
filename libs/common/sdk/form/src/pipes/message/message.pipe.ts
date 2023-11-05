import { Pipe, inject, type PipeTransform } from '@angular/core';
import { type Observable } from 'rxjs';
import { CommonMessageService } from '../../services';

@Pipe({
  name: 'message',
  standalone: true,
})
export class MessagePipe<customMessageDataT extends Record<string, string>>
  implements PipeTransform
{
  private _messageService = inject(CommonMessageService<customMessageDataT>);

  transform(messageKey: keyof customMessageDataT): Observable<string> {
    return this._messageService.getMessage(messageKey);
  }
}
