import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartViewComponent {
  protected readonly cart = inject(CartService);
  protected readonly moneda = environment.moneda;
}
