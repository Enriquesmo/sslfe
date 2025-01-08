import { Component, AfterViewInit,Output, EventEmitter } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { PagosService } from '../pagos.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
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
  private clientSecret: string = ''; // Variable para guardar el client_secret
  private stripePromise: Promise<Stripe | null>;
  private stripe: Stripe | null = null; // Guardamos la instancia de Stripe
  private cardElement: StripeCardElement | null = null; // Guardamos el elemento de tarjeta
  
  amount: number = 3; // Variable para el monto ingresado
  email: string = ''; // Variable para el email del usuario
  @Output() paymentCompleted = new EventEmitter<void>(); // Emitirá el evento cuando el pago sea completado
  constructor(private pagosService: PagosService,private route: ActivatedRoute,private router: Router) {
    this.stripePromise = loadStripe('pk_test_51Q7a1xAINUUPHMJgyxRmYKZ1e3KjJd9zKZuOprAy4cpSkYNru0pnB5hasdKPiNA4bIWT3sw75abL73g7iHbWct3G00nBjDwrco');
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';  // Si no se pasa el email, lo dejamos vacío
    });
  }

  ngAfterViewInit() {
    const elementsContainer = document.getElementById('stripe-payment-form');
    
    // Después de que Stripe se haya cargado
    this.stripePromise.then((stripe) => {
      if (!stripe) {
        console.error('Error al cargar Stripe.');
        return;
      }
      this.stripe = stripe; // Asignamos la instancia de Stripe
      const elements: StripeElements = stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount(elementsContainer!);
    });
  }

// Método que prepara la transacción al hacer clic en "Ir al pago"
prepararPago() {
  if (this.amount <= 0) {
    alert('Por favor, introduce un importe válido.');
    return;
  }

  // Usamos el servicio para preparar la transacción y obtener el client_secret
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

  // Paso 1: Crear el PaymentMethod con Stripe
  this.stripe.createPaymentMethod({
    type: 'card',
    card: this.cardElement,
  }).then(({ error, paymentMethod }) => {
    if (error) {
      alert('Error al crear el PaymentMethod: ' + error.message);
    } else if (paymentMethod) {
      // Paso 2: Confirmar el pago con el backend
      this.pagosService.confirmarPago(paymentMethod.id, this.email, this.clientSecret).subscribe({
        next: (response) => {
          if (response.message) {
            alert(response.message);  // Muestra el mensaje de éxito recibido del backend
            this.paymentCompleted.emit(); // Emitimos el evento de pago completa
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
