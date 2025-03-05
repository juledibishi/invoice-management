import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DaoComunicatorService } from '../../service/dao-comunicator.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const dao = inject(DaoComunicatorService)

  return dao.checkAuth().pipe(
    map(valid => {
      if (valid) {
        return true;
      } else {
        router.navigate(['login']);
        return false;
      }
    })
  );
};
