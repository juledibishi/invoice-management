import { Pipe, PipeTransform } from '@angular/core';
import { IClient } from '../models/client.model';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: IClient[], filterByName?: string): IClient[] {
    if (!filterByName || filterByName.toLowerCase() === 'name' || value.length === 0) {
      return value;
    } else {
      const filtered = value.filter(client =>
        client.name.toLowerCase().includes(filterByName.toLowerCase())
      )
      return filtered
    }
  }
}
