import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDebt',
  standalone: true
})
export class FilterDebtPipe implements PipeTransform {

  transform(clients: any[], filterType: string): any[] {
    if (!clients || filterType === 'all') return clients;
    if (filterType === 'debt') return clients.filter(client => client.debt !== '0');
    if (filterType === 'paid') return clients.filter(client => client.debt === '0');
    return clients;
  }

}
