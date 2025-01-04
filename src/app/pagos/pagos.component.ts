import { Component, AfterViewInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';  // Importamos loadStripe

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements AfterViewInit {
  private clientSecret: string = ''; // Variable para guardar el client_secret
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    // Carga de Stripe de forma asíncrona con tu clave pública
    this.stripePromise = loadStripe('pk_test_51Q7a1xAINUUPHMJgyxRmYKZ1e3KjJd9zKZuOprAy4cpSkYNru0pnB5hasdKPiNA4bIWT3sw75abL73g7iHbWct3G00nBjDwrco');
  }

  ngAfterViewInit() {
    const elementsContainer = document.getElementById('stripe-payment-form');

    this.stripePromise.then((stripe) => {
      if (!stripe) {
        console.error('Error al cargar Stripe.');
        return;
      }

      const elements = stripe.elements();
      const cardElement = elements.create('card');
      cardElement.mount(elementsContainer!);

      const payButton = document.getElementById('pay-button') as HTMLButtonElement;
      const confirmButton = document.getElementById('confirm-payment-button') as HTMLButtonElement;
      const stripeForm = document.getElementById('stripe-form') as HTMLDivElement;
      const paymentForm = document.getElementById('payment-form') as HTMLFormElement;
      const amountInput = document.getElementById('amount') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;

      payButton?.addEventListener('click', async () => {
        const amount = parseFloat(amountInput.value);
        const email = emailInput.value;

        if (isNaN(amount) || amount <= 0) {
          alert('Por favor, introduce un importe válido.');
          return;
        }

        if (!email) {
          alert('Por favor, introduce un correo electrónico válido.');
          return;
        }

        const url = 'https://localhost:9000/pagos/prepararTransaccion';
        try {
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, email })
          });

          if (!response.ok) {
            throw new Error('Error al procesar el pago');
          }

          this.clientSecret = await response.text();

          stripeForm.style.display = 'block';
          paymentForm.style.display = 'none';
          confirmButton.style.display = 'block';
        } catch (error) {
          console.error('Error:', error);
          alert('Hubo un problema al intentar procesar el pago.');
        }
      });

      confirmButton?.addEventListener('click', async () => {
        const stripeInstance = await this.stripePromise;

        if (!stripeInstance) {
          alert('Stripe no está disponible.');
          return;
        }

        const { error, paymentIntent } = await stripeInstance.confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: cardElement
          }
        });

        if (error) {
          alert('Error en el pago: ' + error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          alert('Pago exitoso!');
          console.log('PaymentIntent ID:', paymentIntent.id);
          console.log('Email:', emailInput.value);

          const confirmUrl = `http://localhost:9000/pagos/confirmarPago?paymentIntentId=${paymentIntent.id}&email=${encodeURIComponent(emailInput.value)}`;
          try {
            const confirmResponse = await fetch(confirmUrl, {
              method: 'POST'
            });

            if (!confirmResponse.ok) {
              throw new Error('Error al confirmar el pago');
            }

            const confirmMessage = await confirmResponse.text();
            alert(confirmMessage);
          } catch (confirmError) {
            console.error('Error al confirmar el pago:', confirmError);
            alert('Hubo un problema al confirmar el pago.');
          }
        }
      });
    });
  }
}
