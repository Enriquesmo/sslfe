import { Component, AfterViewInit,Output, EventEmitter } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { PagosService } from '../pagos.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements AfterViewInit {
  private clientSecret: string = ''; 
  private stripePromise: Promise<Stripe | null>;
  private stripe: Stripe | null = null; 
  private cardElement: StripeCardElement | null = null; 
  
  amount: number = 3; 
  email: string = ''; 
  @Output() paymentCompleted = new EventEmitter<void>(); 
  constructor(private pagosService: PagosService,private route: ActivatedRoute,private router: Router) {
    this.stripePromise = loadStripe('');
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';  
    });
  }

  ngAfterViewInit() {
    const elementsContainer = document.getElementById('stripe-payment-form');
    
    this.stripePromise.then((stripe) => {
      if (!stripe) {
        console.error('Error al cargar Stripe.');
        return;
      }
      this.stripe = stripe; 
      const elements: StripeElements = stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount(elementsContainer!);
    });
  }

prepararPago() {
  if (this.amount <= 0) {
    alert('Por favor, introduce un importe válido.');
    return;
  }

  this.pagosService.prepararTransaccion(this.amount).subscribe({
    next: (clientSecret) => {
      console.log('Client Secret recibido:', clientSecret);
      this.clientSecret = clientSecret; // Asignamos el client_secret recibido
      document.getElementById('stripe-form')!.style.display = 'block';
      document.getElementById('payment-form')!.style.display = 'none';
      document.getElementById('confirm-payment-button')!.style.display = 'block';
    },
    error: (error) => {
      console.error('Error al preparar la transacción:', error.error);
      alert('Hubo un problema al intentar procesar el pago. Detalles: ' + error.error);
    }
  });
  
}


confirmarPago() {
  if (!this.stripe || !this.cardElement) {
    alert('Stripe no está disponible o la tarjeta no ha sido cargada.');
    return;
  }

  this.stripe.createPaymentMethod({
    type: 'card',
    card: this.cardElement,
  }).then(({ error, paymentMethod }) => {
    if (error) {
      alert('Error al crear el PaymentMethod: ' + error.message);
    } else if (paymentMethod) {
      this.pagosService.confirmarPago(paymentMethod.id, this.email, this.clientSecret).subscribe({
        next: (response) => {
          if (response.message) {
            alert(response.message);  
            this.paymentCompleted.emit(); 
            this.router.navigate(['/MainPage']);
          } else {
            alert('Respuesta inesperada del backend');
          }
        },
        error: (confirmError) => {
          alert('Error al confirmar el pago: ' + confirmError.error.message);
          console.error('Error al confirmar el pago:', confirmError);
          alert('Hubo un problema al confirmar el pago.');
        }
      });
    }
  }).catch(error => {
    alert('Error al procesar el pago: ' + error.message);
  });
  
}

}
