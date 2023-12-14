
# Ratatouille23 Cuscione N86003575

## Guida di Avvio Rapido

Questo README fornisce istruzioni rapide su come far partire l'applicazione utilizzando Docker Compose.

### Prerequisiti

- Assicurati di avere Docker e Docker Compose installati sulla tua macchina.

### Installazione e Avvio

1. Naviga nella directory del progetto.

3. Modifica il file `compose.yml` per includere il tuo indirizzo ip. Trova la variabile d'ambiente `WEBSOCKET_ALLOWED_ORIGINS` e cambiala come segue:

    ```yaml
    services:
      backend:
        ...
        environment:
          - WEBSOCKET_ALLOWED_ORIGINS=http://tuoindirizzoiplocale:3000
    ```

    Sostituisci `nome-del-servizio` con il nome effettivo del servizio Docker che vuoi configurare.

4. Esegui Docker Compose:

    ```bash
    docker-compose up -d
    ```

    Questo comando avvierà l'applicazione in background. Puoi monitorare i log eseguendo `docker-compose logs -f`.

5. L'applicazione dovrebbe essere ora accessibile all'indirizzo [http://localhost:3000/](http://localhost:3000/) nel tuo browser.

### Arresto dell'Applicazione

Per arrestare l'applicazione, esegui il seguente comando nella directory del progetto:

```bash
docker-compose down
```
### Dati dell'Applicazione
All avvio dell' app vengono creati automaticamente
un admin pizzeria con password: Password01.

Sono inoltre presenti anche altri account staff per l'attivita:
waiter1, waiter2, manager, chef1.

tutti gli account hanno password: Password01.
