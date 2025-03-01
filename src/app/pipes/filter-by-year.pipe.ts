import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByYear',
  standalone: true
})
export class FilterByYearPipe implements PipeTransform {

  transform(clients: any[], selectedYear: string): any[] {
    if (selectedYear === 'all') {
      return clients;
    }
    return clients.filter(client => {
      const clientYear = new Date(client.created_at).getFullYear();
      return clientYear.toString() === selectedYear;
    });
  }
}
